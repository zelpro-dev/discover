const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");
const { embedSettings } = require("../../../config")
const GuildSchema = require("../../../schemas/GuildSchema");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Registra tu bot o servidor en Discover"),
  options: {
    cooldown: 5000,
    permissions: PermissionFlagsBits.Administrator,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    const guild = await GuildSchema.findOne({ guildID: interaction.guild.id })
    if(guild) return interaction.reply({ content: "⚠️ Este servidor ya está en Discover.", ephemeral: true })

    if(interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: "⚠️ No eres el dueño del servidor.", ephemeral: true })
    
    const embed = new EmbedBuilder()
      .setTitle("Discover")
      .setDescription(`¡Bienvenido al comando de configuración! Soy Discover, tu asistente personal dedicado a dar a conocer tu propio servidor o bot.

Con este comando puedes iniciar el proceso de subida de tu servidor o bot de manera rápida y sencilla

¡No dudes en pedir ayuda si la necesitas! Estoy aquí para hacer que tu experiencia de subida sea lo más fluida y exitosa posible.`)
      .setColor(embedSettings.color)

    const module_menu = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("setup")
        .setPlaceholder("➡️ Escoge que quieres subir a Discover.")
        .addOptions(
          { label: "Servidor", value: "server", emoji: "⚙️" },
          { label: "Bot", value: "bot", emoji: "🤖" },
        )
    );

    interaction.reply({ embeds: [embed], components: [module_menu] });

  },
};
