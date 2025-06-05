const { Schema, model } = require('mongoose');

const logSchema = new Schema({
  guildId: { type: String, required: true },
  type: { type: String, required: true }, // ex: 'mute', 'ban', 'kick'
  userId: { type: String, required: true },
  moderatorId: { type: String, required: true },
  reason: { type: String, default: 'Não informado' },
  date: { type: Date, default: Date.now }
});

module.exports = model('Log', logSchema);
