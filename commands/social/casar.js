const { SlashCommandBuilder } = require('discord.js');
const UserProfile = require('../../database/models/UserProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('casar')
    .setDescription('Peça alguém em casamento.')
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Pessoa que você quer casar')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const target = interaction.options.getUser('usuário');
    const user = interaction.user;

    if (target.bot || target.id === user.id) {
      return interaction.reply({ content: '❌ Você não pode se casar com esse usuário.', ephemeral: true });
    }

    const userData = await UserProfile.findOne({ userId: user.id, guildId: interaction.guild.id });
    const targetData = await UserProfile.findOne({ userId: target.id, guildId: interaction.guild.id });

    if (userData?.marriedTo || targetData?.marriedTo) {
      return interaction.reply({ content: '💔 Um de vocês já está casado.', ephemeral: true });
    }

    await interaction.reply({
      content: `💍 ${target}, você aceita se casar com ${user}?`,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 3,
              label: 'Aceitar',
              custom_id: `accept_marriage_${user.id}`,
            },
            {
              type: 2,
              style: 4,
              label: 'Recusar',
              custom_id: `decline_marriage_${user.id}`,
            }
          ]
        }
      ]
    });
  }
};
