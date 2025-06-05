module.exports.execute = async (interaction, client) => {
const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../database/models/Ticket');

module.exports = async function createTicket(interaction, categoria) {
  const existing = await Ticket.findOne({
    guildId: interaction.guild.id,
    userId: interaction.user.id,
    status: 'aberto'
  });

  if (existing) {
    return interaction.reply({ content: `❌ Você já possui um ticket aberto em <#${existing.channelId}>`, ephemeral: true });
  }

  const supportRoleId = 'ID_DO_CARGO_DE_SUPORTE'; // Substitua com o ID real

  const channel = await interaction.guild.channels.create({
    name: `🎫・${categoria}-${interaction.user.username}`,
    type: ChannelType.GuildText,
    permissionOverwrites: [
      { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] },
      { id: supportRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
    ]
  });

  const embed = new EmbedBuilder()
    .setTitle(`🎟️ Ticket: ${categoria}`)
    .setDescription(`Olá ${interaction.user}, um membro da equipe irá te ajudar com **${categoria}** em breve.\nClique abaixo para **fechar o ticket**.`)
    .setColor('#00b0f4');

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('fechar_ticket')
      .setLabel('❌ Fechar')
      .setStyle(ButtonStyle.Danger)
  );

  await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] });

  await Ticket.create({
    guildId: interaction.guild.id,
    userId: interaction.user.id,
    ticketId: `${interaction.user.id}-${Date.now()}`,
    channelId: channel.id
  });

  await interaction.reply({ content: `✅ Ticket de **${categoria}** criado em <#${channel.id}>`, ephemeral: true });
};

};