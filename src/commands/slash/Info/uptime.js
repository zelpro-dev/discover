const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require("../../../config");
const { embedSettings } = require("../../../config")

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Revisa el tiempo online del Bot'),
    options: {
        cooldown: 5000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        

    }
};
