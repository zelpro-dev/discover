const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");
const { embedSettings } = require("../../../config");
const GuildSchema = require("../../../schemas/GuildSchema");
const moment = require('moment-timezone');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("boost")
    .setDescription("Boostea tu servidor!"),
  options: {
    cooldown: 5000,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const guild = await GuildSchema.findOne({ guildID: interaction.guild.id });
      if (!guild) {
        return interaction.reply({ content: "⚠️ Este servidor no forma parte de GrowUp.", ephemeral: true });
      }

      if(guild.solicitud !== "aceptado") return interaction.reply({ content: "⚠️ Este servidor no forma parde de GrowUp.", ephemeral: true });

      let lastBoost;
      if (guild.lastBoost instanceof Date) {
        lastBoost = moment(guild.lastBoost).add(2, 'hours');
      } else {
        lastBoost = moment(new Date(guild.lastBoost)).add(2, 'hours');
      }

      if (lastBoost.isAfter(moment())) {
        const remainingTime = lastBoost.unix();
        return interaction.reply({ content: `❄️ Podrás boostear de nuevo <t:${remainingTime}:R>`, ephemeral: true });
      }

      guild.lastBoost = new Date().toISOString(); // Aseguramos que se guarde en formato ISO
      await guild.save();

      const proximoBoost = moment().add(2, 'hours').unix();
      interaction.reply({ content: `🚀 Servidor boosteado, siguiente boost <t:${proximoBoost}:R>!` });
    } catch (error) {
      console.error('Error al boostear el servidor:', error);
      interaction.reply({ content: "⚠️ Hubo un error al intentar boostear el servidor. Por favor, inténtalo nuevamente más tarde.", ephemeral: true });
    }
  },
};
