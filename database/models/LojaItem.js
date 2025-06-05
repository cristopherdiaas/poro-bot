// database/models/LojaItem.js
const mongoose = require('mongoose');

const lojaItemSchema = new mongoose.Schema({
  name: String,
  type: String, // banner, border, icon, title
  price: Number,
  assetUrl: String,
  description: String
});

module.exports = mongoose.model('LojaItem', lojaItemSchema);
