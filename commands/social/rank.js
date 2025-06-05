const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserProfile = require('../../database/models/UserProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Veja o top 10 usuários com maior nível no servidor.'),

  async execute(interaction, client) {
    const top = await UserProfile.find({ guildId: interaction.guild.id })
      .sort({ level: -1, xp: -1 })
      .limit(10);

    const embed = new EmbedBuilder()
      .setTitle('🏆 Ranking de Nível')
      .setColor('Purple')
      .setDescription(
        top.map((user, i) => {
          const userTag = `<@${user.userId}>`;
          return `**${i + 1}.** ${userTag} — Nível ${user.level} (${user.xp} XP)`;
        }).join('\n')
      );

    interaction.reply({ embeds: [embed] });
  }
};
