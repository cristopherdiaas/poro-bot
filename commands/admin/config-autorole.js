const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../database/models/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config-autorole')
    .setDescription('Defina um cargo automático para novos membros.')
    .addRoleOption(option =>
      option.setName('cargo')
        .setDescription('Cargo a ser atribuído automaticamente')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ Você precisa ser administrador.', ephemeral: true });
    }

    const role = interaction.options.getRole('cargo');

    await Guild.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { autoRoleId: role.id },
      { upsert: true }
    );

    return interaction.reply(`✅ Cargo automático definido como: ${role}`);
  }
};
