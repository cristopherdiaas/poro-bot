// database/models/Titulo.js
const mongoose = require('mongoose');

const tituloSchema = new mongoose.Schema({
  name: String,
  rarity: { type: String, enum: ['comum', 'raro', 'épico', 'lendário'], default: 'comum' },
  description: String,
  requisito: String // chave identificadora da missão
});

module.exports = mongoose.model('Titulo', tituloSchema);
