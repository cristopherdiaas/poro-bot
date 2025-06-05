const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserProfile = require('../../database/models/UserProfile');
const Item = require('../../database/models/Item');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventario-full')
    .setDescription('Veja seu inventário.'),

  async execute(interaction, client) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    const userData = await UserProfile.findOne({ userId, guildId }).populate('inventory.itemId');
    if (!userData || userData.inventory.length === 0)
      return interaction.reply({ content: '📦 Seu inventário está vazio.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle(`🎒 Inventário de ${interaction.user.username}`)
      .setColor('Green')
      .setDescription(
        userData.inventory.map(i =>
          `${i.itemId.emoji} **${i.itemId.name}** x${i.quantity}`
        ).join('\n')
      );

    interaction.reply({ embeds: [embed] });
  }
};
