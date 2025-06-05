const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa um membro do servidor.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário a ser expulso')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo da expulsão')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: '❌ Você não tem permissão para expulsar membros.', ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo') || 'Sem motivo';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member || !member.kickable) {
      return interaction.reply({ content: '❌ Não consigo expulsar esse membro.', ephemeral: true });
    }

    await member.kick(motivo);
    return interaction.reply(`✅ ${user.tag} foi expulso. Motivo: ${motivo}`);
  }
};
