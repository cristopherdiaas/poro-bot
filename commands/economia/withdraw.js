const { SlashCommandBuilder } = require('discord.js');
const UserEconomy = require('../../database/models/UserEconomy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Saca moedas do banco.')
    .addIntegerOption(opt => opt.setName('quantidade').setDescription('Valor a sacar').setRequired(true)),

  async execute(interaction, client) {
    const amount = interaction.options.getInteger('quantidade');
    const userData = await UserEconomy.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

    if (!userData || userData.bank < amount || amount <= 0) {
      return interaction.reply({ content: '❌ Valor inválido ou saldo bancário insuficiente.', ephemeral: true });
    }

    userData.bank -= amount;
    userData.wallet += amount;
    await userData.save();

    interaction.reply(`💼 Você sacou **${amount} moedas** da sua conta bancária.`);
  }
};
