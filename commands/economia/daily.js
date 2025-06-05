const { SlashCommandBuilder } = require('discord.js');
const UserEconomy = require('../../database/models/UserEconomy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Receba sua recompensa diária (24h).'),

  async execute(interaction, client) {
    const reward = 500;
    const cooldown = 24 * 60 * 60 * 1000;

    let userData = await UserEconomy.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
    if (!userData) userData = await UserEconomy.create({ userId: interaction.user.id, guildId: interaction.guild.id });

    const now = Date.now();
    if (userData.lastDaily && now - userData.lastDaily < cooldown) {
      const timeLeft = cooldown - (now - userData.lastDaily);
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return interaction.reply(`⏳ Você já coletou hoje. Tente novamente em ${hours}h ${minutes}min.`);
    }

    userData.wallet += reward;
    userData.lastDaily = now;
    await userData.save();

    interaction.reply(`🎉 Você coletou sua recompensa diária de **${reward} moedas**!`);
  }
};
