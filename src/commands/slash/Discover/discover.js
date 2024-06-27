const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, ButtonBuilder, ButtonStyle } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");
const { embedSettings } = require("../../../config");
const icon = require('../../../icon.json');
const GuildSchema = require("../../../schemas/GuildSchema");
const moment = require('moment-timezone');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("discover")
    .setDescription("Encuentra lo que buscas con este comando"),
  options: {
    cooldown: 60000,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    const embed = new EmbedBuilder()
      .setTitle("Discover")
      .setDescription(`¡Bienvenido al comando de descubrimiento! Gracias a este comando podrás descubrir servidores nuevos. Haz click en el botón de abajo para comenzar la búsqueda.`)
      .setColor(embedSettings.color);

    const buscar = new ButtonBuilder()
      .setCustomId(`buscar_discover`)
      .setEmoji("1253674875474673726")
      .setStyle(ButtonStyle.Primary);

    const button = new ActionRowBuilder()
      .addComponents(buscar);

    await interaction.reply({ embeds: [embed], components: [button], ephemeral: true });

    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30_000 });

    function getPageButtons(currentPage, totalPages, item) {
      const buttons = [];
      buttons.push(new ButtonBuilder().setCustomId('anterior').setEmoji('1231561014965964840').setStyle(ButtonStyle.Primary).setDisabled(currentPage === 0));
      buttons.push(new ButtonBuilder().setCustomId('siguiente').setEmoji('1231561015817273396').setStyle(ButtonStyle.Primary).setDisabled(currentPage === totalPages - 1));
      buttons.push(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Unirse").setURL(item.invite));
      return new ActionRowBuilder().addComponents(buttons);
    }

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        i.reply({ content: `*Este botón no te pertenece!*`, ephemeral: true });
        return;
      }
      await i.deferUpdate()
      await collector.stop()
      const seleccion = i.customId;
      switch (seleccion) {
        case "buscar_discover":

          const guilds = await GuildSchema.find({ solicitud: { $ne: 'pendiente' } }).sort({ lastBoost: -1 });
          const totalPages = Math.ceil(guilds.length);

          let currentPage = 0;
          const currentItem = guilds[currentPage];

          const generatePageEmbed = (currentPage, item) => {

            const guild = client.guilds.cache.get(item.guildID);

            if (!guild) {
              console.log(`ERR: ${guild}`);
              return interaction.editReply({ content: "⚠️ Hubo un error, vuelve a intentarlo en unos minutos.", embeds: [], components: [] });
            }

            const lastBoostDate = new Date(item.lastBoost).toISOString();
            const lastBoost = moment(lastBoostDate).unix();

            let response;

            if (item.reviews.length === 0) {
              response = 'No hay reseñas';
            } else {
              const totalRatings = item.reviews.reduce((sum, review) => sum + review.rating, 0);
              const averageRating = totalRatings / item.reviews.length;
              const roundedAverageRating = Math.round(averageRating);
              response = "⭐".repeat(roundedAverageRating);
            }

            const embed = new EmbedBuilder()
              .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true, size: 128 }) })
              .setDescription(`${item.descripcion}`)
              .addFields(
                { name: 'Valoración', value: response, inline: true },
                { name: 'Usuarios', value: `${guild.memberCount}`, inline: true },
                { name: 'Última vez boosteado', value: `<t:${lastBoost}:R>`, inline: true },
              )
              .setColor(embedSettings.color);

            return embed;
          };

          await interaction.editReply({ embeds: [generatePageEmbed(currentPage, currentItem)], components: [getPageButtons(currentPage, totalPages, currentItem)] });

          const collector1 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120_000 });

          collector1.on('collect', async (i) => {
            try {
              if (i.customId === 'anterior' && currentPage > 0) {
                currentPage--;
              } else if (i.customId === 'siguiente' && currentPage < totalPages - 1) {
                currentPage++;
              }
              await i.deferUpdate();
              const currentItem = guilds[currentPage];
              await interaction.editReply({ embeds: [generatePageEmbed(currentPage, currentItem)], components: [getPageButtons(currentPage, totalPages, currentItem)] });
            } catch (error) {
              console.error('Error al cambiar de página:', error);
            }
          });

          collector1.on('end', async () => {
            await interaction.editReply({ components: [] }).catch(console.error);
          });

          break;
      }
    });

    collector.on('end', collected => {
      return;
      // console.log(`Collected ${collected.size} interactions.`);
    });

  },
};
