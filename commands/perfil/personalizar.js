const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');
const UserEconomy = require('../../database/models/UserEconomy');
const LojaItem = require('../../database/models/LojaItem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('personalizar')
    .setDescription('Equipe banners, bordas ou ícones do seu perfil.')
    .addSubcommand(sub =>
      sub.setName('banner')
        .setDescription('Equipe um banner do seu inventário'))
    .addSubcommand(sub =>
      sub.setName('borda')
        .setDescription('Equipe uma borda do seu inventário'))
    .addSubcommand(sub =>
      sub.setName('icone')
        .setDescription('Equipe um ícone do seu inventário')),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const tipo = interaction.options.getSubcommand(); // banner, borda, icone
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    const economyData = await UserEconomy.findOne({ userId, guildId }).populate('inventory');
    if (!economyData || !economyData.inventory.length) {
      return interaction.editReply('❌ Você não possui itens no seu inventário.');
    }

    const itens = economyData.inventory.filter(item => item.type === tipo);
    if (!itens.length) {
      return interaction.editReply(`❌ Você não possui nenhum item do tipo \`${tipo}\`.`);
    }

    const embed = new EmbedBuilder()
      .setTitle(`🎨 Equipar ${tipo}`)
      .setDescription('Selecione um item abaixo para equipar no seu perfil.')
      .setColor('#00BFFF');

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('equipar_' + tipo)
        .setPlaceholder(`Selecione um ${tipo}`)
        .addOptions(itens.slice(0, 25).map(item => ({
          label: item.name,
          value: item._id.toString(),
          description: item.description?.slice(0, 50) || 'Sem descrição'
        })))
    );

    return interaction.editReply({ embeds: [embed], components: [row] });
  }
};