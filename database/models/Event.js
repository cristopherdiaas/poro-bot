const { Schema, model } = require('mongoose');

const levelSchema = new Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  lastMessage: { type: Date, default: Date.now }
});

levelSchema.index({ guildId: 1, userId: 1 }, { unique: true });

module.exports = model('Level', levelSchema);
