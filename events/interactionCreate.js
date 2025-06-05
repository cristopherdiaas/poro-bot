const { Events, EmbedBuilder } = require('discord.js');
const Titulo = require('../database/models/Titulo');
const UserProfile = require('../database/models/UserProfile');
const LojaItem = require('../database/models/LojaItem');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      // Comandos normais
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction, interaction.client);
      }

      // Menus de seleção
      if (interaction.isSelectMenu()) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;
        const userData = await UserProfile.findOne({ userId, guildId });
        if (!userData) {
          return interaction.reply({ content: '❌ Perfil não encontrado.', ephemeral: true });
        }

        const valorSelecionado = interaction.values[0];

        // TÍTULO
        if (interaction.customId === 'selecionar_titulo') {
          const titulo = await Titulo.findById(valorSelecionado);
          if (!titulo || !userData.titulosDesbloqueados.includes(titulo._id)) {
            return interaction.reply({ content: '❌ Título inválido ou não desbloqueado.', ephemeral: true });
          }
          userData.profile.title = titulo._id;
          await userData.save();
          return interaction.reply({
            content: `✅ Título \`${titulo.name}\` equipado com sucesso!`,
            ephemeral: true
          });
        }

        // PERSONALIZAÇÃO (banner, borda, ícone)
        const tiposSuportados = ['banner', 'borda', 'icone'];
        for (const tipo of tiposSuportados) {
          if (interaction.customId === `equipar_${tipo}`) {
            const item = await LojaItem.findById(valorSelecionado);
            if (!item || item.type !== tipo) {
              return interaction.reply({ content: `❌ Item inválido para o tipo \`${tipo}\`.`, ephemeral: true });
            }

            userData.profile[tipo] = item._id;
            await userData.save();

            const embed = new EmbedBuilder()
              .setTitle(`✅ ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} equipado`)
              .setDescription(`Você equipou **${item.name}** com sucesso!`)
              .setColor('#00BFFF')
              .setImage(item.assetUrl || null);

            return interaction.reply({ embeds: [embed], ephemeral: true });
          }
        }
      }
    } catch (err) {
      console.error("Erro ao lidar com interaction:", err);
      if (!interaction.replied && !interaction.deferred) {
        interaction.reply({ content: '❌ Ocorreu um erro ao processar sua interação.', ephemeral: true });
      }
    }
  }
};
