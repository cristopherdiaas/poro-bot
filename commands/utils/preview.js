const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const LojaItem = require('../../database/models/LojaItem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('preview')
    .setDescription('Visualize um item pelo ID antes de equipar')
    .addStringOption(opt =>
      opt.setName('id')
        .setDescription('ID do item que deseja visualizar')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const id = interaction.options.getString('id');
    const item = await LojaItem.findById(id);

    if (!item) {
      return interaction.editReply('❌ Item não encontrado.');
    }

    const embed = new EmbedBuilder()
      .setTitle(`📦 Preview: ${item.name}`)
      .setDescription(item.description || 'Sem descrição.')
      .addFields(
        { name: '🗂️ Tipo', value: item.type, inline: true },
        item.rarity ? { name: '⭐ Raridade', value: item.rarity, inline: true } : null
      ).setImage(item.assetUrl || null)
      .setColor('#00BFFF')
      .setFooter({ text: `ID: ${item._id}` });

    return interaction.editReply({ embeds: [embed] });
  }
};