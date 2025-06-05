const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('limpar')
    .setDescription('Limpa mensagens em um canal.')
    .addIntegerOption(opt =>
      opt.setName('quantidade')
        .setDescription('Quantidade de mensagens (máx. 100)')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: '❌ Você não tem permissão.', ephemeral: true });
    }

    const qtd = interaction.options.getInteger('quantidade');
    if (qtd > 100 || qtd < 1) return interaction.reply('❌ Informe um número entre 1 e 100.');

    const messages = await interaction.channel.bulkDelete(qtd, true);
    return interaction.reply(`🧹 ${messages.size} mensagens foram apagadas.`);
  }
};
