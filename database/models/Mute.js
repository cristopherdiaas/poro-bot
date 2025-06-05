const mongoose = require('mongoose');

const muteSchema = new mongoose.Schema({
  guildId: String,
  userId: String,
  moderatorId: String,
  reason: String,
  expiresAt: Date
});

module.exports = mongoose.model('Mute', muteSchema);
