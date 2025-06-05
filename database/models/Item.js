const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  emoji: { type: String, default: '📦' },
  roleReward: { type: String, default: null },
  type: {
    type: String,
    enum: ['default', 'banner', 'border', 'icon', 'title'],
    default: 'default',
  },
  assetUrl: { type: String, default: null },
  rarity: {
    type: String,
    enum: ['comum', 'raro', 'epico', 'lendario'],
    default: 'comum'
  }
});

module.exports = mongoose.model('Item', itemSchema);
