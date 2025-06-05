const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Jimp = require('jimp');
const path = require('path');
const UserProfile = require('../../database/models/UserProfile');
const Economy = require('../../database/models/UserEconomy');

function getBordaPorLevel(level) {
  const basePath = path.join(__dirname, '../../assets/bordas');
  if (level >= 50) return path.join(basePath, 'diamante.png');
  if (level >= 30) return path.join(basePath, 'platina.png');
  if (level >= 20) return path.join(basePath, 'ouro.png');
  if (level >= 10) return path.join(basePath, 'prata.png');
  if (level >= 5)  return path.join(basePath, 'bronze.png');
  return path.join(basePath, 'iniciante.png');
}

function createXPBar(currentXP, level) {
  const xpToNextLevel = 100 + level * 50;
  const percent = Math.min(currentXP / xpToNextLevel, 1);
  const filled = Math.round(percent * 20);
  const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
  return `\`${bar}\` ${Math.floor(percent * 100)}%`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('Veja seu perfil social.'),

  async execute(interaction, client) {
    await interaction.deferReply();

    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    const ecoData = await Economy.findOne({ userId, guildId });
    const wallet = ecoData?.wallet || 0;
    const bank = ecoData?.bank || 0;

    const userData = await UserProfile.findOne({ userId, guildId })
      .populate('profile.banner')
      .populate('profile.border')
      .populate('profile.icon')
      .populate('profile.title');

    if (!userData) {
      return interaction.editReply({ content: '❌ Perfil não encontrado.', ephemeral: true });
    }

    const avatarURL = interaction.user.displayAvatarURL({ extension: 'png', size: 256 });
    const bordaPath = getBordaPorLevel(userData.level);

    const [avatar, borda] = await Promise.all([
      Jimp.read(avatarURL),
      Jimp.read(bordaPath)
    ]);

    avatar.resize(256, 256).circle(); // Arredonda o avatar
    borda.resize(256, 256);

    const composicao = new Jimp(256, 256, 0x00000000)
      .composite(avatar, 0, 0)
      .composite(borda, 0, 0);

    const buffer = await composicao.getBufferAsync(Jimp.MIME_PNG);
    const attachment = new AttachmentBuilder(buffer, { name: 'perfil_avatar.png' });

    const conquistas = [];
    if (userData.marriedTo) conquistas.push('💍');
    if (wallet >= 10000) conquistas.push('💸');
    if (userData.inventory?.length > 0) conquistas.push('🛍️');
    if (userData.level >= 10) conquistas.push('🧱');
    const umAno = 1000 * 60 * 60 * 24 * 365;
    if (Date.now() - interaction.user.createdTimestamp >= umAno) conquistas.push('🕐');

    const bannerUrl = userData.profile.banner?.assetUrl || undefined;

    const embed = new EmbedBuilder()
      .setTitle(`👤 ${userData.profile.title?.name || interaction.user.username}`)
      .setColor('#00BFFF')
      .addFields(
        { name: '🪙 Carteira', value: `**${wallet}**`, inline: true },
        { name: '🏦 Banco', value: `**${bank}**`, inline: true },
        { name: '🏆 Nível', value: `**${userData.level}**`, inline: true },
        { name: '🎖️ XP', value: `**${userData.xp} XP**`, inline: true },
        { name: '📊 Progresso de XP', value: createXPBar(userData.xp, userData.level) },
        { name: '🏅 Conquistas', value: conquistas.length ? conquistas.join(' ') : '`Nenhuma conquista desbloqueada.`' },
        { name: '📅 Conta criada no Discord', value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:D>` }
      )
      .setFooter({ text: `${interaction.user.username} • Perfil`, iconURL: interaction.user.displayAvatarURL() })
      .setThumbnail('attachment://perfil_avatar.png');

    if (bannerUrl) embed.setImage(bannerUrl);

    await interaction.editReply({
      embeds: [embed],
      files: [attachment]
    });
  }
};