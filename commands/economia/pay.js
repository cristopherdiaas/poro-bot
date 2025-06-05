const { SlashCommandBuilder } = require('discord.js');
const UserEconomy = require('../../database/models/UserEconomy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Envie moedas para outro membro.')
    .addUserOption(opt => opt.setName('destino').setDescription('Quem receberá').setRequired(true))
    .addIntegerOption(opt => opt.setName('quantidade').setDescription('Quantas moedas').setRequired(true)),

  async execute(interaction, client) {
    const target = interaction.options.getUser('destino');
    const amount = interaction.options.getInteger('quantidade');

    if (target.id === interaction.user.id) return interaction.reply({ content: '❌ Você não pode pagar a si mesmo.', ephemeral: true });
    if (amount <= 0) return interaction.reply({ content: '❌ O valor deve ser maior que 0.', ephemeral: true });

    const sender = await UserEconomy.findOne({ userId: interaction.user.id, guildId: interaction.guild.id }) || await UserEconomy.create({ userId: interaction.user.id, guildId: interaction.guild.id });
    const receiver = await UserEconomy.findOne({ userId: target.id, guildId: interaction.guild.id }) || await UserEconomy.create({ userId: target.id, guildId: interaction.guild.id });

    if (sender.wallet < amount) return interaction.reply({ content: '❌ Você não tem moedas suficientes.', ephemeral: true });

    sender.wallet -= amount;
    receiver.wallet += amount;
    await sender.save();
    await receiver.save();

    interaction.reply(`✅ Você enviou **${amount} moedas** para ${target.username}!`);
  }
};
