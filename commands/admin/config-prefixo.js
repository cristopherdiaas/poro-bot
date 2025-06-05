const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../database/models/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config-prefixo')
    .setDescription('Altere o prefixo do bot neste servidor.')
    .addStringOption(option =>
      option.setName('prefixo')
        .setDescription('Novo prefixo')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ Você precisa ser administrador.', ephemeral: true });
    }

    const prefix = interaction.options.getString('prefixo');
    const guildId = interaction.guild.id;

    let data = await Guild.findOneAndUpdate({ guildId }, { prefix }, { new: true, upsert: true });
    return interaction.reply(`✅ Prefixo atualizado para \`${prefix}\``);
  }
};
