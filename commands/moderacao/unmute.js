const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove o silêncio de um membro.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário a ser desmutado')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      return interaction.reply({ content: '❌ Você não tem permissão.', ephemeral: true });
    }

    const member = interaction.options.getMember('usuario');

    if (!member || !member.moderatable) {
      return interaction.reply({ content: '❌ Não consigo remover o silêncio desse membro.', ephemeral: true });
    }

    await member.timeout(null);
    return interaction.reply(`🔊 ${member.user.tag} foi desmutado.`);
  }
};
