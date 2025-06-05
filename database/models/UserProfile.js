const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: String,
  guildId: String,
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  coins: { type: Number, default: 0 },
  job: { type: String, default: null },
  marriedTo: { type: String, default: null },
  marriageDate: { type: Date, default: null },
  titulosDesbloqueados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Titulo' }],
  mensagensEnviadas: Number,
  comandosUsados: Number,
  mensagensComJungler: Number,
  joinedAt: Date,

bio: { type: String, default: "Olá! Eu sou novo por aqui!" },
inventory: [
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number, default: 1 }
  }
],
profile: {
  banner: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  border: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  icon: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  title: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
},
profile: {
  banner: { type: mongoose.Schema.Types.ObjectId, ref: 'LojaItem' },
  border: { type: mongoose.Schema.Types.ObjectId, ref: 'LojaItem' },
  icon:   { type: mongoose.Schema.Types.ObjectId, ref: 'LojaItem' },
  title:  { type: mongoose.Schema.Types.ObjectId, ref: 'LojaItem' }
},
});


module.exports = mongoose.model('UserProfile', userProfileSchema);
