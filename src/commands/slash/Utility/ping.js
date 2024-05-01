const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require("../../../config");
const { embedSettings } = require("../../../config")

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Revisa la latencia del Bot'),
    options: {
        cooldown: 5000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        const embed = new EmbedBuilder()
            .setTitle("Ping")
            .setDescription("`" + client.ws.ping + "ms`")
            .setColor(embedSettings.color)

        await interaction.reply({ embeds: [embed] });

    }
};
