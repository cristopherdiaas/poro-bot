const { Schema, model } = require('mongoose');

const punishmentSchema = new Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  type: { type: String, enum: ['mute', 'ban', 'warn'], required: true },
  reason: { type: String, default: 'Sem motivo' },
  duration: { type: Number, default: null }, // em milissegundos
  active: { type: Boolean, default: true },
  issuedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

module.exports = model('Punishment', punishmentSchema);
