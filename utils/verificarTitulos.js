const Titulo = require('../database/models/Titulo');
const UserProfile = require('../database/models/UserProfile');

async function verificarTitulos(interaction, userData, economyData) {
  const novosTitulos = [];

  // Consulta todos os títulos do banco
  const todosTitulos = await Titulo.find();

  for (const titulo of todosTitulos) {
    const requisito = titulo.requisito;

    const jaTem = userData.titulosDesbloqueados?.some(id => id.equals(titulo._id));
    if (jaTem) continue;

    const agora = Date.now();
    const contaAntiga = agora - interaction.user.createdTimestamp;

    let desbloquear = false;

    switch (requisito) {
      case 'admin_only':
        if (interaction.member.permissions.has('Administrator')) desbloquear = true;
        break;
      case 'mensagem_50':
        if (userData.mensagensEnviadas >= 50) desbloquear = true;
        break;
      case 'mensagem_250':
        if (userData.mensagensEnviadas >= 250) desbloquear = true;
        break;
      case 'nivel_3':
        if (userData.level >= 3) desbloquear = true;
        break;
      case 'nivel_10':
        if (userData.level >= 10) desbloquear = true;
        break;
      case 'nivel_25':
        if (userData.level >= 25) desbloquear = true;
        break;
      case 'moeda_10000':
        if (economyData.wallet >= 10000) desbloquear = true;
        break;
      case 'moeda_50000':
        if (economyData.wallet >= 50000) desbloquear = true;
        break;
      case 'tempo_7d':
        if (userData.joinedAt && agora - userData.joinedAt >= 1000 * 60 * 60 * 24 * 7) desbloquear = true;
        break;
      case 'tempo_30d':
        if (userData.joinedAt && agora - userData.joinedAt >= 1000 * 60 * 60 * 24 * 30) desbloquear = true;
        break;
      case 'conta_1ano':
        if (contaAntiga >= 1000 * 60 * 60 * 24 * 365) desbloquear = true;
        break;
      case 'comandos_15':
        if (userData.comandosUsados >= 15) desbloquear = true;
        break;
      case 'palavra_jungler':
        if (userData.mensagensComJungler >= 10) desbloquear = true;
        break;
      default:
        break;
    }

    if (desbloquear) {
      if (!userData.titulosDesbloqueados) userData.titulosDesbloqueados = [];
      userData.titulosDesbloqueados.push(titulo._id);
      novosTitulos.push(titulo.name);
    }
  }

  if (novosTitulos.length > 0) await userData.save();
  return novosTitulos;
}

module.exports = verificarTitulos;
