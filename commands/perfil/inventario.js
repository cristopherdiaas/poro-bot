const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../database/models/UserEconomy');
const LojaItem = require('../../database/models/LojaItem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventario')
    .setDescription('Veja os itens que você possui em seu inventário.'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    const economyData = await UserEconomy.findOne({ userId, guildId }).populate('inventory');

    if (!economyData || !economyData.inventory.length) {
      return interaction.editReply('📦 Você ainda não possui itens no seu inventário.');
    }

    const items = economyData.inventory;

    const embed = new EmbedBuilder()
      .setTitle('🎒 Seu Inventário')
      .setColor('#00BFFF')
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

    for (const item of items) {
      embed.addFields({
        name: `${item.name} [${item.type}]`,
        value: `🆔 \`${item._id}\`\n💬 ${item.description || 'Sem descrição.'}`,
        inline: false
      });
    }

    return interaction.editReply({ embeds: [embed] });
  }
};
