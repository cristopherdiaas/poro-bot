console.log("URI do MongoDB:", process.env.MONGO_URI);
const Jimp = require('jimp');

Jimp.read('https://i.imgur.com/2DhmtJ4.png')
  .then(image => {
    console.log('Imagem carregada com sucesso:', image.bitmap.width, image.bitmap.height);
  })
  .catch(err => {
    console.error('Erro ao carregar imagem:', err);
  });
