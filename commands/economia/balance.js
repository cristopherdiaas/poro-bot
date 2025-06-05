const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../database/models/UserEconomy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Verifique seu saldo ou o de outro membro.')
    .addUserOption(option =>
      option.setName('usuário').setDescription('Membro para verificar o saldo')
    ),

  async execute(interaction, client) {
    const member = interaction.options.getUser('usuário') || interaction.user;

    let userData = await UserEconomy.findOne({ userId: member.id, guildId: interaction.guild.id });
    if (!userData) {
      userData = await UserEconomy.create({ userId: member.id, guildId: interaction.guild.id });
    }

    const embed = new EmbedBuilder()
      .setTitle(`💰 Saldo de ${member.username}`)
      .setColor('Gold')
      .addFields(
        { name: '👜 Carteira', value: `${userData.wallet} moedas`, inline: true },
        { name: '🏦 Banco', value: `${userData.bank} moedas`, inline: true }
      );

    interaction.reply({ embeds: [embed] });
  }
};
