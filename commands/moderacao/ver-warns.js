const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Warn = require('../../database/models/Warn');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ver-warns')
    .setDescription('Veja os avisos de um membro.')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Membro que você quer ver os avisos')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser('usuario');
    const warns = await Warn.find({ guildId: interaction.guild.id, userId: user.id });

    if (warns.length === 0) {
      return interaction.reply(`✅ ${user.tag} não possui avisos.`);
    }

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Avisos de ${user.tag}`)
      .setColor('#e67e22')
      .setDescription(warns.map((w, i) => `**${i + 1}.** ${w.reason} *(<t:${Math.floor(w.date.getTime() / 1000)}:R>)*`).join('\n'));

    return interaction.reply({ embeds: [embed] });
  }
};
