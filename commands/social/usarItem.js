const { SlashCommandBuilder } = require('discord.js');
const UserProfile = require('../../database/models/UserProfile');
const Item = require('../../database/models/Item');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('usaritem')
    .setDescription('Usa um item cosmético do inventário.')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Nome exato do item que deseja usar')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const itemName = interaction.options.getString('item');
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    const userData = await UserProfile.findOne({ userId, guildId }).populate('inventory.itemId');
    if (!userData) return interaction.reply({ content: 'Perfil não encontrado.', ephemeral: true });

    const inventoryItem = userData.inventory.find(i => i.itemId.name.toLowerCase() === itemName.toLowerCase());
    if (!inventoryItem) return interaction.reply({ content: '❌ Você não possui esse item.', ephemeral: true });

    const item = inventoryItem.itemId;

    if (!['banner', 'border', 'icon', 'title'].includes(item.type))
      return interaction.reply({ content: '❌ Este item não é usável como personalização.', ephemeral: true });

    userData.profile[item.type] = item._id;
    await userData.save();

    interaction.reply(`✅ Você agora está usando o item **${item.name}** como seu ${item.type}.`);
  }
};
