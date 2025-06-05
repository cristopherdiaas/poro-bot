const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Item = require('../../database/models/Item');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('additem')
    .setDescription('Adicionar um item à loja (admin only).')
    // ✅ Opções obrigatórias primeiro
    .addStringOption(option =>
      option.setName('nome')
        .setDescription('Nome do item')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('descricao')
        .setDescription('Descrição do item')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('preco')
        .setDescription('Preço do item')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('tipo')
        .setDescription('Tipo do item (default, banner, border, icon, title)')
        .setRequired(true)
        .addChoices(
          { name: 'default', value: 'default' },
          { name: 'banner', value: 'banner' },
          { name: 'border', value: 'border' },
          { name: 'icon', value: 'icon' },
          { name: 'title', value: 'title' }
        ))
    .addStringOption(option =>
      option.setName('raridade')
        .setDescription('Raridade do item')
        .setRequired(true)
        .addChoices(
          { name: 'Comum', value: 'comum' },
          { name: 'Raro', value: 'raro' },
          { name: 'Épico', value: 'epico' },
          { name: 'Lendário', value: 'lendario' }
        ))
    // 🟡 Opções opcionais depois
    .addStringOption(option =>
      option.setName('emoji')
        .setDescription('Emoji do item')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('url')
        .setDescription('URL da imagem (para itens visuais)')
        .setRequired(false)),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ content: '❌ Você precisa ser administrador para usar este comando.', ephemeral: true });

    const nome = interaction.options.getString('nome');
    const descricao = interaction.options.getString('descricao');
    const preco = interaction.options.getInteger('preco');
    const tipo = interaction.options.getString('tipo');
    const raridade = interaction.options.getString('raridade');
    const emoji = interaction.options.getString('emoji') || '📦';
    const url = interaction.options.getString('url') || null;

    const novoItem = new Item({
      name: nome,
      description: descricao,
      price: preco,
      emoji,
      type: tipo,
      assetUrl: url,
      rarity: raridade,
    });

    await novoItem.save();

    interaction.reply(`✅ Item **${nome}** adicionado com sucesso à loja!`);
  }
};
