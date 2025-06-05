const mongoose = require('mongoose');

const userEconomySchema = new mongoose.Schema({
  userId: String,
  guildId: String,
  wallet: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  lastDaily: { type: Date, default: null },
  dailyStreak: { type: Number, default: 0 },
  lastWeekly: { type: Date, default: null },
  inventory: [{ item: String, quantity: Number }]
});

module.exports = mongoose.model('UserEconomy', userEconomySchema);
