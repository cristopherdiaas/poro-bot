const Ticket = require('../../database/models/Ticket');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  customId: 'fechar_ticket',
  async execute(interaction) {
    const ticket = await Ticket.findOne({ channelId: interaction.channel.id, status: 'aberto' });
    if (!ticket) {
      return interaction.reply({ content: '❌ Este ticket já foi fechado ou não existe.', ephemeral: true });
    }

    // Transcrição (simples)
    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    const content = messages
      .reverse()
      .map(m => `[${m.createdAt.toISOString()}] ${m.author.tag}: ${m.content}`)
      .join('\n');

    const transcript = `Transcrição do Ticket:\n\n${content}`;

    // Enviar transcrição para um canal de logs
    const logsChannelId = 'ID_DO_CANAL_DE_LOGS'; // Substitua com o ID real
    const logsChannel = interaction.guild.channels.cache.get(logsChannelId);
    if (logsChannel) {
      logsChannel.send({
        content: `📄 Transcrição do ticket de <@${ticket.userId}>`,
        files: [{ attachment: Buffer.from(transcript), name: `ticket-${interaction.channel.name}.txt` }]
      });
    }

    await Ticket.updateOne({ _id: ticket._id }, { status: 'fechado' });

    await interaction.reply({ content: '🔒 Ticket fechado. Este canal será deletado em 5 segundos.' });
    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 5000);
  }
};
