const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  ticketId: { type: String, required: true },
  channelId: { type: String, required: true },
  status: { type: String, default: 'aberto' }, // ou 'fechado'
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date }
});

module.exports = model('Ticket', ticketSchema);
