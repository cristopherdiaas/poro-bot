const { SlashCommandBuilder } = require('discord.js');
const Warn = require('../../database/models/Warn');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avisa um membro formalmente.')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Membro a ser avisado')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('motivo')
        .setDescription('Motivo do aviso')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has('KickMembers')) {
      return interaction.reply({ content: '❌ Permissão negada.', ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo');

    await Warn.create({
      guildId: interaction.guild.id,
      userId: user.id,
      moderatorId: interaction.user.id,
      reason: motivo
    });

    return interaction.reply(`⚠️ ${user.tag} recebeu um aviso. Motivo: ${motivo}`);
  }
};
