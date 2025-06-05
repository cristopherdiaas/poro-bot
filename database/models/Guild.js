const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  prefix: {
    type: String,
    default: '!'
  },
  logChannelId: {
    type: String,
    default: null
  },
  autoRoleId: {
    type: String,
    default: null
  },
  welcomeChannelId: {
    type: String,
    default: null
  },
  welcomeMessage: {
    type: String,
    default: 'Bem-vindo(a) ao servidor!'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Guild', guildSchema);
