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

        const uptimeSeconds = Math.floor(client.uptime / 1000);
        const sent = await interaction.reply({ content: '*📡 Calculando latencia...*', fetchReply: true, ephemeral: true });
        const timeTaken = sent.createdTimestamp - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
            .addFields(
                { name: 'Bot', value: "`" + `${timeTaken}ms` + "`", inline: false },
                { name: 'Websocket', value: "`" + `${client.ws.ping}ms` + "`", inline: false },
                { name: 'Tiempo Online', value: `<t:${Math.floor((Date.now() - client.uptime) / 1000)}:R>`, inline: false },
            )
            .setColor(embedSettings.color);

        await interaction.editReply({ content: "", embeds: [embed], ephemeral: true });

    }
};
