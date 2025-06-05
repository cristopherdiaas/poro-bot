const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');
const UserProfile = require('../../database/models/UserProfile');
const Titulo = require('../../database/models/Titulo');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('titulos')
    .setDescription('Veja seus títulos desbloqueados e como conseguir outros.'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    const userData = await UserProfile.findOne({ userId, guildId }).populate('titulosDesbloqueados');
    const todosTitulos = await Titulo.find();

    const desbloqueados = userData?.titulosDesbloqueados || [];
    const desbloqueadosIds = desbloqueados.map(t => t._id.toString());

    const embed = new EmbedBuilder()
      .setTitle('🎖️ Títulos')
      .setColor('#FFD700')
      .setDescription('Títulos desbloqueados e bloqueados (🔒). Use o seletor abaixo para equipar.');

    const options = [];

    for (const titulo of todosTitulos) {
      const desbloqueado = desbloqueadosIds.includes(titulo._id.toString());
      const simbolo = desbloqueado ? '' : '🔒 ';
      const nome = simbolo + titulo.name;
      const desc = `${titulo.description || 'Sem descrição.'} [${titulo.rarity}]`;

      embed.addFields({
        name: nome,
        value: desc,
        inline: false
      });

      if (desbloqueado) {
        options.push({
          label: titulo.name,
          value: titulo._id.toString(),
          description: `[${titulo.rarity}] ${titulo.description?.slice(0, 50) || ''}`.trim()
        });
      }
    }

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('selecionar_titulo')
        .setPlaceholder('Escolha um título para equipar')
        .addOptions(options.slice(0, 25)) // Discord limita a 25 opções
    );

    await interaction.editReply({
      embeds: [embed],
      components: options.length > 0 ? [row] : []
    });
  }
};
