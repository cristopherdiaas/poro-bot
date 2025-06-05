require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

function getAllCommandFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllCommandFiles(fullPath));
    } else if (entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
}

const commandFiles = getAllCommandFiles(commandsPath);

for (const file of commandFiles) {
  const command = require(file);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`⚠️ Ignorando comando inválido: ${file}`);
  }
}

// 🔍 Verificação de comandos duplicados
const nomes = commands.map(c => c.name);
const duplicados = nomes.filter((item, index) => nomes.indexOf(item) !== index);

if (duplicados.length > 0) {
  console.error('❌ Comandos duplicados detectados:', [...new Set(duplicados)]);
  process.exit(1); // Encerra o processo
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🛠️ Registrando ${commands.length} comandos no servidor ${process.env.GUILD_ID}`);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✅ Todos os comandos foram registrados com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
})();
