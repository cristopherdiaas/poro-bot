const { Schema, model } = require('mongoose');

const commandSchema = new Schema({
  guildId: { type: String, required: true },
  name: { type: String, required: true },
  response: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

commandSchema.index({ guildId: 1, name: 1 }, { unique: true });

module.exports = model('Command', commandSchema);
