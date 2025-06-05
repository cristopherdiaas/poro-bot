const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketpainel')
    .setDescription('Envia o painel com categorias de tickets.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle('🎫 Sistema de Suporte')
      .setDescription('Escolha uma categoria para abrir um ticket:')
      .setColor('#00b0f4');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_suporte').setLabel('💬 Suporte').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('ticket_denuncia').setLabel('🚨 Denúncia').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('ticket_parceria').setLabel('🤝 Parceria').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('ticket_sugestao').setLabel('💡 Sugestão').setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ content: '✅ Painel de tickets enviado!', ephemeral: true });
    await interaction.channel.send({ embeds: [embed], components: [row] });
  }
};
