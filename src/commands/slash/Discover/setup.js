const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");
const { embedSettings } = require("../../../config")
const GuildSchema = require("../../../schemas/GuildSchema");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Registra tu servidor en GrowUp"),
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
    if (guild) return interaction.reply({ content: "⚠️ Este servidor ya está en GrowUp.", ephemeral: true })

    if (interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: "⚠️ No eres el dueño del servidor.", ephemeral: true })

    const ownerId = interaction.guild.ownerId
    if (interaction.user.id !== ownerId) return interaction.update({ content: `⚠️ No eres el dueño de este servidor` })

    const embed = new EmbedBuilder()
      .setTitle("Setup")
      .setDescription(`¡Bienvenido al comando de configuración! Soy GrowUp, tu asistente personal dedicado a dar a conocer tu propio servidor.
Con este comando puedes iniciar el proceso de subida de tu servidor de manera rápida y sencilla, a continuación verás un botón el cual te mostrará un formulario. 
Se te pedirá una descripción para tu servidor.
¡Ten imaginación y escribe algo que te anime a entrar a tu servidor!`)
      .setColor(embedSettings.color)

    const show_modal = new ButtonBuilder()
      .setCustomId(`setup_modal_servidor`)
      .setLabel('Rellenar Formulario')
      .setEmoji("📃")
      .setStyle(ButtonStyle.Primary);

    const button = new ActionRowBuilder()
      .addComponents(show_modal);

    interaction.reply({ embeds: [embed], components: [button] });

  },
};
