const { SlashCommandBuilder } = require('discord.js');
const Item = require('../../database/models/Item');
const UserProfile = require('../../database/models/UserProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comprar')
    .setDescription('Compre um item da loja.')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Nome exato do item')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const itemName = interaction.options.getString('item');
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    const item = await Item.findOne({ name: itemName });
    if (!item)
      return interaction.reply({ content: '❌ Item não encontrado.', ephemeral: true });

    const userData = await UserProfile.findOne({ userId, guildId });

    if (!userData || userData.coins < item.price)
      return interaction.reply({ content: '❌ Você não tem moedas suficientes.', ephemeral: true });

    // Atualiza inventário
    const existingItem = userData.inventory.find(i => i.itemId.equals(item._id));
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      userData.inventory.push({ itemId: item._id, quantity: 1 });
    }

    userData.coins -= item.price;
    await userData.save();

    interaction.reply(`✅ Você comprou **${item.name}** por **${item.price} moedas**.`);
  }
};
