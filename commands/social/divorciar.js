const { SlashCommandBuilder } = require('discord.js');
const UserProfile = require('../../database/models/UserProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('divorciar')
    .setDescription('Divorcie-se do seu parceiro.'),

  async execute(interaction, client) {
    const user = interaction.user;
    const data = await UserProfile.findOne({ userId: user.id, guildId: interaction.guild.id });

    if (!data?.marriedTo) {
      return interaction.reply({ content: '❌ Você não está casado.', ephemeral: true });
    }

    const partnerId = data.marriedTo;

    await UserProfile.findOneAndUpdate(
      { userId: user.id, guildId: interaction.guild.id },
      { marriedTo: null, marriageDate: null }
    );

    await UserProfile.findOneAndUpdate(
      { userId: partnerId, guildId: interaction.guild.id },
      { marriedTo: null, marriageDate: null }
    );

    interaction.reply(`💔 Você se divorciou de <@${partnerId}>.`);
  }
};
