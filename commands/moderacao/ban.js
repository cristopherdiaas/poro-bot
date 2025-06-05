const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bane um membro do servidor.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário a ser banido')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do banimento')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: '❌ Você não tem permissão para banir membros.', ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo') || 'Sem motivo';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ Usuário não encontrado.', ephemeral: true });

    if (!member.bannable) {
      return interaction.reply({ content: '❌ Não consigo banir esse membro.', ephemeral: true });
    }

    await member.ban({ reason: motivo });
    return interaction.reply(`✅ ${user.tag} foi banido. Motivo: ${motivo}`);
  }
};
