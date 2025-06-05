const UserProfile = require('../database/models/UserProfile');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const randomXP = Math.floor(Math.random() * 10) + 5; // XP aleatório por mensagem
    let userData = await UserProfile.findOne({ userId: message.author.id, guildId: message.guild.id });

    if (!userData) {
      userData = await UserProfile.create({ userId: message.author.id, guildId: message.guild.id });
    }

    userData.xp += randomXP;

    const xpForNextLevel = userData.level * 300;
    if (userData.xp >= xpForNextLevel) {
      userData.xp -= xpForNextLevel;
      userData.level += 1;
      message.channel.send(`🎉 ${message.author}, você subiu para o nível ${userData.level}!`);
    }

    await userData.save();
  }
};
