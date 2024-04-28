const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");
const { embedSettings } = require("../../../config");
const GuildSchema = require("../../../schemas/GuildSchema");
const moment = require('moment-timezone');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("boost")
    .setDescription("Boostea tu servidor o bot (próximamente)!"),
  options: {
    cooldown: 5000,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    const guild = await GuildSchema.findOne({ guildID: interaction.guild.id })
    if (!guild) return interaction.reply({ content: "⚠️ Este servidor no forma parte de Discover.", ephemeral: true })

    const lastBoostDate = new Date(guild.lastBoost).toISOString()
    const lastBoost = moment(lastBoostDate).add(2, 'hours')

    if (lastBoost && moment().isBefore(lastBoost)) {
      const remainingTime = lastBoost.unix()
      return interaction.reply({ content: `❄️ Podrás boostear de nuevo <t:${remainingTime}:R>`, ephemeral: true })
    }

    await GuildSchema.findOneAndUpdate({ guildID: interaction.guild.id, lastBoost: new Date() })

    const proximoBoost = moment().add(2, 'hours').unix()

    interaction.reply({ content: `🚀 Servidor boosteado, siguiente boost <t:${proximoBoost}:R>!` });

  },
};
