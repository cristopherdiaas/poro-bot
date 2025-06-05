const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Mute = require('../../database/models/Mute');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Silencia um membro temporariamente.')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Membro a ser mutado')
        .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('tempo')
        .setDescription('Tempo em minutos')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('motivo')
        .setDescription('Motivo do mute')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      return interaction.reply({ content: '❌ Você não tem permissão para mutar membros.', ephemeral: true });
    }

    const member = interaction.options.getMember('usuario');
    const tempo = interaction.options.getInteger('tempo');
    const motivo = interaction.options.getString('motivo') || 'Sem motivo';
    const duracao = tempo * 60 * 1000;

    if (!member || !member.moderatable) {
      return interaction.reply({ content: '❌ Não consigo silenciar esse membro.', ephemeral: true });
    }

    await member.timeout(duracao, motivo);

    await Mute.create({
      guildId: interaction.guild.id,
      userId: member.id,
      moderatorId: interaction.user.id,
      reason: motivo,
      expiresAt: new Date(Date.now() + duracao)
    });

    return interaction.reply(`🔇 ${member.user.tag} foi silenciado por ${tempo} minuto(s).\nMotivo: ${motivo}`);
  }
};
