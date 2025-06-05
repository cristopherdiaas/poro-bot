// reset-commands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🧹 Limpando todos os comandos do servidor ${process.env.GUILD_ID}...`);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: [] }
    );
    console.log('✅ Todos os comandos foram removidos com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao limpar comandos:', error);
  }
})();
