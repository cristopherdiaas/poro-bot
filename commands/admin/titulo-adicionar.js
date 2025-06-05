const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Titulo = require('../../database/models/Titulo');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('titulo-adicionar')
    .setDescription('Gerenciar títulos do perfil (admin)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub.setName('adicionar')
        .setDescription('Adiciona um novo título ao sistema')
        .addStringOption(opt =>
          opt.setName('nome')
            .setDescription('Nome do título')
            .setRequired(true))
        .addStringOption(opt =>
          opt.setName('raridade')
            .setDescription('Raridade do título')
            .setRequired(true)
            .addChoices(
              { name: 'comum', value: 'comum' },
              { name: 'raro', value: 'raro' },
              { name: 'épico', value: 'épico' },
              { name: 'lendário', value: 'lendário' }
            ))
        .addStringOption(opt =>
          opt.setName('descricao')
            .setDescription('Descrição do título')
            .setRequired(true))
        .addStringOption(opt =>
          opt.setName('requisito')
            .setDescription('Chave interna para desbloqueio (ex: mensagem_50)')
            .setRequired(true))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'adicionar') {
      const nome = interaction.options.getString('nome');
      const raridade = interaction.options.getString('raridade');
      const descricao = interaction.options.getString('descricao');
      const requisito = interaction.options.getString('requisito');

      const jaExiste = await Titulo.findOne({ name: nome });
      if (jaExiste) {
        return interaction.reply({ content: '❌ Já existe um título com esse nome.', ephemeral: true });
      }

      const novo = await Titulo.create({
        name: nome,
        rarity: raridade,
        description: descricao,
        requisito: requisito
      });

      return interaction.reply({
        content: `✅ Título \`${novo.name}\` adicionado com sucesso!`,
        ephemeral: true
      });
    }
  }
};
