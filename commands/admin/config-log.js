const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../database/models/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config-log')
    .setDescription('Defina o canal de logs do servidor.')
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Canal onde os logs serão enviados')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ Você precisa ser administrador.', ephemeral: true });
    }

    const canal = interaction.options.getChannel('canal');

    await Guild.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { logChannelId: canal.id },
      { upsert: true }
    );

    return interaction.reply(`✅ Canal de logs definido como: ${canal}`);
  }
};
