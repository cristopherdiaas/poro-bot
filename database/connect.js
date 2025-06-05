const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connect('mongodb+srv://botuser:SUA_SENHA@botcluster.mongodb.net/mybotdb?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
  }
};
