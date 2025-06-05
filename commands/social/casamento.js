const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserProfile = require('../../database/models/UserProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('casamento')
    .setDescription('Veja com quem você está casado.'),

  async execute(interaction, client) {
    const user = interaction.user;
    const data = await UserProfile.findOne({ userId: user.id, guildId: interaction.guild.id });

    if (!data?.marriedTo) {
      return interaction.reply({ content: '❌ Você não está casado.', ephemeral: true });
    }

    const partner = await interaction.guild.members.fetch(data.marriedTo).catch(() => null);
    if (!partner) {
      return interaction.reply({ content: '⚠️ Não foi possível encontrar seu parceiro(a).', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('💍 Casamento')
      .setColor('Pink')
      .setDescription(`${user} está casado com ${partner.user}.`)
      .addFields({ name: 'Desde', value: `<t:${Math.floor(data.marriageDate.getTime() / 1000)}:R>` });

    interaction.reply({ embeds: [embed] });
  }
};
