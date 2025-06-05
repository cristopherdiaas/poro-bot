const { SlashCommandBuilder } = require('discord.js');
const UserProfile = require('../../database/models/UserProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bio')
    .setDescription('Edite sua biografia.')
    .addStringOption(opt =>
      opt.setName('texto').setDescription('Nova bio').setRequired(true).setMaxLength(100)
    ),

  async execute(interaction, client) {
    const texto = interaction.options.getString('texto');
    const userData = await UserProfile.findOneAndUpdate(
      { userId: interaction.user.id, guildId: interaction.guild.id },
      { $set: { bio: texto } },
      { new: true, upsert: true }
    );

    interaction.reply(`✅ Sua bio foi atualizada para: "${texto}"`);
  }
};
