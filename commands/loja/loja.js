const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Item = require('../../database/models/Item');

const rarityEmojis = {
  comum: '⚪',
  raro: '🔵',
  epico: '🟣',
  lendario: '🟡',
};

const rarityColors = {
  comum: '#95a5a6',
  raro: '#3498db',
  epico: '#9b59b6',
  lendario: '#f1c40f',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loja')
    .setDescription('Veja os itens disponíveis na loja')
    .addStringOption(option =>
      option.setName('raridade')
        .setDescription('Filtrar por raridade')
        .setRequired(false)
        .addChoices(
          { name: 'Comum', value: 'comum' },
          { name: 'Raro', value: 'raro' },
          { name: 'Épico', value: 'epico' },
          { name: 'Lendário', value: 'lendario' },
        )),

  async execute(interaction, client) {
    await interaction.deferReply();
    const filterRarity = interaction.options.getString('raridade');

    let query = {};
    if (filterRarity) query.rarity = filterRarity;

    const items = await Item.find(query).sort({ rarity: 1, price: 1 });
    if (!items.length) return interaction.reply('Nenhum item encontrado para essa raridade.');

    const itemsPerPage = 5;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    let page = 0;

    const generateEmbed = (pageIndex) => {
      const slice = items.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

      let description = '';
      slice.forEach(item => {
        description += `${item.emoji || '📦'} **${item.name}** — ${item.price} moedas\n${item.description}\n\n`;
      });

      return new EmbedBuilder()
        .setTitle(`🛒 Loja do Servidor ${filterRarity ? `- ${filterRarity.charAt(0).toUpperCase() + filterRarity.slice(1)}` : ''}`)
        .setDescription(description)
        .setColor(filterRarity ? rarityColors[filterRarity] : '#3498db')
        .setFooter({ text: `Página ${pageIndex + 1} de ${totalPages}` });
    };

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('⬅️ Anterior')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === 0),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Próximo ➡️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === totalPages - 1),
      );

    await interaction.editReply({ embeds: [generateEmbed(page)], components: [row] });
    const embedMessage = await interaction.fetchReply();

    const collector = embedMessage.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: 'Somente quem usou o comando pode interagir.', ephemeral: true });
      }

      if (i.customId === 'prev' && page > 0) page--;
      else if (i.customId === 'next' && page < totalPages - 1) page++;

      row.components[0].setDisabled(page === 0);
      row.components[1].setDisabled(page === totalPages - 1);

      await i.update({ embeds: [generateEmbed(page)], components: [row] });
    });

    collector.on('end', () => {
      row.components.forEach(button => button.setDisabled(true));
      interaction.editReply({ components: [row] });
    });
  }
};
