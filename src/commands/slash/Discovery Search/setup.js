const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");
const { embedSettings } = require("../../../config")
const GuildSchema = require("../../../schemas/GuildSchema");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Registra tu bot o servidor en Discover ⭐"),
  options: {
    cooldown: 15000,
    permissions: PermissionFlagsBits.Administrator,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    
    const embed = new EmbedBuilder()
      .setTitle("Discover")
      .setDescription(`Hola ${interaction.user}, gracias a este comando podrás configurar tu servidor de manera rápida y automatizada.\n\nPara empezar, **escoge los módulos** que quieres en tu servidor. *(No te preocupes que luego podrás editarlos)*`)
      .setImage(embedSettings.banner)
      .setColor(embedSettings.color)

    const module_menu = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("module-menu")
        .setPlaceholder("➡️ Escoge los módulos que quieras.")
        .setMinValues(1)
        .setMaxValues(8)
        .addOptions(
          { label: "Bienvenidas", value: "bienvenidas", emoji: "🛬" },
          { label: "Despedidas", value: "despedidas", emoji: "🛫" },
          { label: "Verificación", value: "verificacion", emoji: "🔒" },
          { label: "Tickets", value: "tickets", emoji: "🎫" },
          { label: "Autoroles", value: "autoroles", emoji: "🎭" },
          { label: "Sorteos", value: "sorteos", emoji: "🎉" },
          { label: "Sugerencias", value: "sugerencias", emoji: "💡" },
          { label: "Automod", value: "automod", emoji: "⚒️" },
          // TODO: Música, Economía, Moderación
        )
    );

    interaction.reply({ embeds: [embed], components: [module_menu] });

  },
};
