const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');
const Titulo = require('../../database/models/Titulo');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('titulo')
    .setDescription('Gerenciar títulos do sistema (admin)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub.setName('adicionar')
        .setDescription('Adiciona um novo título')
        .addStringOption(opt => opt.setName('nome').setDescription('Nome do título').setRequired(true))
        .addStringOption(opt =>
          opt.setName('raridade')
            .setDescription('Raridade')
            .setRequired(true)
            .addChoices(
              { name: 'comum', value: 'comum' },
              { name: 'raro', value: 'raro' },
              { name: 'épico', value: 'épico' },
              { name: 'lendário', value: 'lendário' }
            ))
        .addStringOption(opt => opt.setName('descricao').setDescription('Descrição do título').setRequired(true))
        .addStringOption(opt => opt.setName('requisito').setDescription('Chave interna de desbloqueio').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('listar')
        .setDescription('Lista todos os títulos cadastrados')
    )
    .addSubcommand(sub =>
      sub.setName('remover')
        .setDescription('Remove um título pelo ID')
        .addStringOption(opt => opt.setName('id').setDescription('ID do título a remover').setRequired(true))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'adicionar') {
      const nome = interaction.options.getString('nome');
      const raridade = interaction.options.getString('raridade');
      const descricao = interaction.options.getString('descricao');
      const requisito = interaction.options.getString('requisito');

      const jaExiste = await Titulo.findOne({ name: nome });
      if (jaExiste)
        return interaction.reply({ content: '❌ Já existe um título com esse nome.', ephemeral: true });

      const novo = await Titulo.create({ name: nome, rarity: raridade, description: descricao, requisito });
      return interaction.reply({ content: `✅ Título \`${novo.name}\` criado com sucesso.`, ephemeral: true });

    } else if (sub === 'listar') {
      const titulos = await Titulo.find();

      if (!titulos.length)
        return interaction.reply({ content: '⚠️ Nenhum título cadastrado.', ephemeral: true });

      const embed = new EmbedBuilder()
        .setTitle('📜 Títulos Cadastrados')
        .setColor('DarkGold');

      titulos.forEach(t => {
        embed.addFields({
          name: `${t.name} [${t.rarity}]`,
          value: `🆔 \`${t._id}\`\n🔑 ${t.requisito}\n💬 ${t.description}`,
          inline: false
        });
      });

      return interaction.reply({ embeds: [embed], ephemeral: true });

    } else if (sub === 'remover') {
      const id = interaction.options.getString('id');
      const titulo = await Titulo.findById(id);

      if (!titulo)
        return interaction.reply({ content: '❌ Título não encontrado.', ephemeral: true });

      await titulo.deleteOne();
      return interaction.reply({ content: `🗑️ Título \`${titulo.name}\` removido com sucesso.`, ephemeral: true });
    }
  }
};
