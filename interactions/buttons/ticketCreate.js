const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../../database/models/Ticket');

module.exports = {
  customId: 'abrir_ticket',

  async execute(interaction) {
    const existing = await Ticket.findOne({
      guildId: interaction.guild.id,
      userId: interaction.user.id,
      status: 'aberto'
    });

    if (existing) {
      return interaction.reply({ content: `❌ Você já possui um ticket aberto em <#${existing.channelId}>`, ephemeral: true });
    }

    const channel = await interaction.guild.channels.create({
      name: `🎫・ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
        },
        {
          id: interaction.client.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels]
        }
      ]
    });

    const embed = new EmbedBuilder()
      .setTitle('🎟️ Ticket Aberto')
      .setDescription(`Olá ${interaction.user}, um membro da equipe irá te atender em breve.\nClique em "Fechar" quando terminar.`)
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

    await interaction.reply({ content: `✅ Ticket criado em <#${channel.id}>`, ephemeral: true });
  }
};
