const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require("../../../config");
const { embedSettings } = require("../../../config")

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('soporte')
        .setDescription('Únete al servidor de soporte oficial del bot'),
    options: {
        cooldown: 5000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        // ! CAMBIAR URL
        const soporte = new ButtonBuilder()
            .setLabel('Unirse')
            .setURL("https://dsc.gg/discover-soporte")
            .setStyle(ButtonStyle.Link);

        const button = new ActionRowBuilder()
            .addComponents(soporte);

        await interaction.reply({ content: `## Servidor de Soporte`, components: [button], ephemeral: true });

    }
};
