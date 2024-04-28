const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ComponentType, Embed, ButtonBuilder, ButtonStyle } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");
const { embedSettings } = require("../../../config")
const icon = require('../../../icon.json');
const GuildSchema = require("../../../schemas/GuildSchema");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("discover")
    .setDescription("Encuentra lo que buscas con este comando."),
  options: {
    cooldown: 5000,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    const embed = new EmbedBuilder()
      .setTitle("Discover")
      .setDescription(`¡Bienvenido al comando de configuración! Soy Discover, tu asistente personal dedicado a dar a conocer tu propio servidor o bot.

Con este comando puedes iniciar el proceso de subida de tu servidor o bot de manera rápida y sencilla

¡No dudes en pedir ayuda si la necesitas! Estoy aquí para hacer que tu experiencia de subida sea lo más fluida y exitosa posible.`)
      .setColor(embedSettings.color)

    const module_menu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("discover")
          .setPlaceholder("➡️ Escoge que quieres buscar.")
          .addOptions(
            { label: "Servidor", value: "server", emoji: "⚙️" },
            { label: "Bot", value: "bot", emoji: "🤖" },
          )
      );

    interaction.reply({ embeds: [embed], components: [module_menu] });

    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 30_000 });

    function getPageButtons(currentPage, totalPages) {
      const buttons = [];
      buttons.push(new ButtonBuilder().setCustomId('prev').setEmoji('1231561014965964840').setStyle(ButtonStyle.Secondary).setDisabled(currentPage === 0));
      buttons.push(new ButtonBuilder().setCustomId('next').setEmoji('1231561015817273396').setStyle(ButtonStyle.Secondary).setDisabled(currentPage === totalPages - 1));  
      return new ActionRowBuilder().addComponents(buttons);
    }

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
      }
      await i.deferUpdate()
      const seleccion = i.values.join(" ")
      switch (seleccion) {
        case "server":

          const guilds = await GuildSchema.find().sort({ lastBoost: -1 });
          const totalPages = Math.ceil(guilds.length);

          let currentPage = 0;
          const currentItem = guilds[currentPage];

          const generatePageEmbed = (currentPage, item) => {

            const guild = client.guilds.cache.get(item.guildID)
            if (!guild) {
              console.log(`ERR: ${guild}`)
              return interaction.editReply({ content: "⚠️ Hubo un error, vuelve a intentarlo en unos minutos.", embeds: [], components: [] })
            }

            const embed = new EmbedBuilder()
              .setTitle(guild.name)
              .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 }))
              .setDescription(`GuildID: ${item.guildID}\nDescripción: ${item.descripcion}\nLast Boost: ${item.lastBoost}\nCreado en: ${item.createdAt}`)
              .setFooter({ text: `📃 ${currentPage + 1}` })
              .setColor(embedSettings.color)

            return embed;
          };

          await interaction.editReply({ embeds: [generatePageEmbed(currentPage, currentItem)], components: [getPageButtons(currentPage, totalPages)] });

          const collector1 = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120_000 });

          collector1.on('collect', async (i) => {
            try {
              if (i.customId === 'prev' && currentPage > 0) {
                currentPage--;
              } else if (i.customId === 'next' && currentPage < totalPages - 1) {
                currentPage++;
              }
              await i.deferUpdate()
              const currentItem = guilds[currentPage];
              await interaction.editReply({ embeds: [generatePageEmbed(currentPage, currentItem)], components: [getPageButtons(currentPage, totalPages)] });
            } catch (error) {
              console.error('Error al cambiar de página:', error);
            }
          });

          collector1.on('end', async () => {
            await interaction.editReply({ components: [] }).catch(console.error);
          });

          break;
        case "bot":



          break;
      }
    });

    collector.on('end', collected => {
      return;
      // console.log(`Collected ${collected.size} interactions.`);
    });

  },
};
