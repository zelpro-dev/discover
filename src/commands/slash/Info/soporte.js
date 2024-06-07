const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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

        const embed = new EmbedBuilder()
            .setTitle("Soporte")
            .setDescription(`> Puedes unirte al servidor de soporte oficial mediante este enlace\nhttps://dsc.gg/discover-soporte`)
            .setColor(embedSettings.color)

        await interaction.reply({ embeds: [embed] });

    }
};
