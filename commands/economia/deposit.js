const { SlashCommandBuilder } = require('discord.js');
const UserEconomy = require('../../database/models/UserEconomy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposita moedas no banco.')
    .addIntegerOption(opt => opt.setName('quantidade').setDescription('Valor a depositar').setRequired(true)),

  async execute(interaction, client) {
    const amount = interaction.options.getInteger('quantidade');
    const userData = await UserEconomy.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

    if (!userData || userData.wallet < amount || amount <= 0) {
      return interaction.reply({ content: '❌ Valor inválido ou saldo insuficiente.', ephemeral: true });
    }

    userData.wallet -= amount;
    userData.bank += amount;
    await userData.save();

    interaction.reply(`🏦 Você depositou **${amount} moedas** no banco.`);
  }
};
