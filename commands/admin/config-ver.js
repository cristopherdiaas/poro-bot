const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Guild = require('../../database/models/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config-ver')
    .setDescription('Veja as configurações atuais deste servidor.'),

  async execute(interaction, client) {
    const data = await Guild.findOne({ guildId: interaction.guild.id });

    if (!data) {
      return interaction.reply('❌ Nenhuma configuração foi encontrada para este servidor.');
    }

    const embed = new EmbedBuilder()
      .setTitle(`⚙️ Configurações de ${interaction.guild.name}`)
      .setColor('#3498db')
      .addFields(
        { name: 'Prefixo', value: data.prefix || '!', inline: true },
        { name: 'Canal de Logs', value: `<#${data.logChannelId || 'nenhum'}>`, inline: true },
        { name: 'Cargo Automático', value: `<@&${data.autoRoleId || 'nenhum'}>`, inline: true },
        { name: 'Canal de Boas-vindas', value: `<#${data.welcomeChannelId || 'nenhum'}>`, inline: true },
        { name: 'Mensagem de Boas-vindas', value: data.welcomeMessage || 'Não definida' }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
