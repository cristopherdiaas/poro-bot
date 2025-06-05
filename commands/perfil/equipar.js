const { SlashCommandBuilder } = require('discord.js');
const UserEconomy = require('../../database/models/UserEconomy');
const UserProfile = require('../../database/models/UserProfile');
const LojaItem = require('../../database/models/LojaItem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('equipar')
    .setDescription('Equipe um item do seu inventário no seu perfil.')
    .addStringOption(option =>
      option.setName('tipo')
        .setDescription('Tipo de item que deseja equipar')
        .setRequired(true)
        .addChoices(
          { name: 'banner', value: 'banner' },
          { name: 'border', value: 'border' },
          { name: 'title', value: 'title' },
          { name: 'icon', value: 'icon' },
        )
    )
    .addStringOption(option =>
      option.setName('id')
        .setDescription('ID do item da loja que você deseja equipar')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const tipo = interaction.options.getString('tipo');
    const itemId = interaction.options.getString('id');

    // Verifica se o item existe e bate com o tipo
    const item = await LojaItem.findById(itemId);
    if (!item)
      return interaction.editReply('❌ Item não encontrado.');

    if (item.type !== tipo)
      return interaction.editReply(`❌ Este item não é do tipo \`${tipo}\`.`);

    // Verifica se o usuário tem esse item no inventário
    const economyData = await UserEconomy.findOne({ userId, guildId });
    if (!economyData?.inventory.includes(item._id))
      return interaction.editReply('❌ Você não possui este item no seu inventário.');

    // Atualiza o perfil do usuário
    let userProfile = await UserProfile.findOne({ userId, guildId });
    if (!userProfile) {
      userProfile = await UserProfile.create({ userId, guildId, profile: {} });
    }

    userProfile.profile[tipo] = item._id;
    await userProfile.save();

    return interaction.editReply(`✅ Item \`${item.name}\` equipado com sucesso no slot \`${tipo}\`!`);
  }
};
