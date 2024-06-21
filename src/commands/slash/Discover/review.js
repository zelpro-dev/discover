const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");
const { embedSettings } = require("../../../config");
const GuildSchema = require("../../../schemas/GuildSchema");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("review")
    .setDescription("Crea una review para este servidor")
    .addStringOption(option => option
      .setName('estrellas')
      .setDescription('Enumera de 1 a 5 la calidad del servidor')
      .setRequired(true)
      .addChoices(
        { name: '⭐', value: '1' },
        { name: '⭐⭐', value: '2' },
        { name: '⭐⭐⭐', value: '3' },
        { name: '⭐⭐⭐⭐', value: '4' },
        { name: '⭐⭐⭐⭐⭐', value: '5' },
      ))
    .addStringOption(option => option
      .setName('review')
      .setDescription('Escribe alguna razón para esta valoración')),
  options: {
    cooldown: 10000,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    const guild = await GuildSchema.findOne({ guildID: interaction.guild.id })
    if (!guild) return interaction.reply({ content: "⚠️ Este servidor no forma parte de GrowUp.", ephemeral: true })

    // Verificar si el usuario ya ha dejado una reseña en este servidor
    const existingReview = guild.reviews.find(review => review.userID === interaction.user.id);
    if (existingReview) return interaction.reply({ content: "⚠️ Ya has dejado una reseña en el servidor.", ephemeral: true })

    const estrellas = parseInt(interaction.options.get("estrellas").value)

    // Si hay una reseña
    if (interaction.options.get("reseña")) {

      const reseña = interaction.options.get("reseña").value
      const review = {
        userID: interaction.user.id,
        rating: estrellas,
        review: reseña
      };

      guild.reviews.push(review);
      await guild.save();

      return interaction.reply({ content: "🚀 ¡Gracias por la reseña! El servidor y yo te agradecemos mucho tu opinión.", ephemeral: true })

    }

    const review = {
      userID: interaction.user.id,
      rating: estrellas,
      review: undefined
    };

    guild.reviews.push(review);
    await guild.save();

    return interaction.reply({ content: "🚀 ¡Gracias por la reseña! El servidor y yo te agradecemos mucho tu opinión.", ephemeral: true })

  },
};
