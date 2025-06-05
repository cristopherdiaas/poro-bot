const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ajuda')
    .setDescription('Veja os comandos disponíveis do Poro Bot'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📘 Lista de Comandos - Poro Bot')
      .setDescription('Aqui estão os principais comandos que você pode usar:')
      .setColor('#00BFFF')
      .addFields(
        { name: '/perfil', value: 'Exibe seu perfil com XP, conquistas e personalizações.', inline: false },
        { name: '/daily', value: 'Receba sua recompensa diária em moedas.', inline: false },
        { name: '/inventario', value: 'Veja os itens que você possui.', inline: false },
        { name: '/personalizar', value: 'Equipe banners, bordas ou ícones do seu perfil.', inline: false },
        { name: '/titulo', value: 'Veja ou equipe títulos desbloqueados.', inline: false },
        { name: '/loja', value: 'Veja e compre itens com moedas.', inline: false },
        { name: '/ajuda', value: 'Exibe esta mensagem de ajuda.', inline: false }
      )
      .setFooter({ text: 'Poro Bot • League of Legends & Social RPG' })
      .setThumbnail(interaction.client.user.displayAvatarURL());

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};