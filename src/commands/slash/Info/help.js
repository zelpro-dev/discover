const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const GuildSchema = require('../../../schemas/GuildSchema');
const { embedSettings } = require("../../../config");

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('help')
        .setDescription('¿Necesitas ayuda?, ejecuta este comando'),
    options: {
        cooldown: 15000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        await interaction.deferReply();

        const mapIntCmds = client.applicationcommandsArray.map((v) => `\`${(v.type === 2 || v.type === 3) ? '' : '/'}${v.name}\`: ${v.description || '(No description)'}`);

        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Ayuda')
                    .addFields(
                        { name: 'Slash commands', value: `${mapIntCmds.join('\n')}` },
                    )
                    .setColor(embedSettings.color)
            ]
        });

    }
};
