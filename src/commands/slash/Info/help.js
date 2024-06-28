const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
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

        // const mapIntCmds = client.applicationcommandsArray.map((v) => `\`${(v.type === 2 || v.type === 3) ? '' : '/'}${v.name}\`: ${v.description || '(No description)'}`);

        /*
/boost: Boostea tu servidor!
/discover: Encuentra lo que buscas con este comando
/invite: Cambia el enlace de invitación a este canal
/review: Crea una review para este servidor
/setup: Registra tu servidor en GrowUp
/help: ¿Necesitas ayuda?, ejecuta este comando
/ping: Revisa la latencia del Bot
/soporte: Únete al servidor de soporte oficial del bot */

        const discover = new ButtonBuilder()
            .setCustomId(`help_discover`)
            .setLabel('Discover')
            .setStyle(ButtonStyle.Primary);

        const info = new ButtonBuilder()
            .setCustomId(`help_info`)
            .setLabel('Información')
            .setStyle(ButtonStyle.Primary);

        const help_menu = new ActionRowBuilder()
            .addComponents(discover, info);

        const embed = new EmbedBuilder()
            .setTitle('Ayuda')
            .setDescription(`Escoge en los botones de abajo sobre que apartado quieres recibir ayuda.`)
            .setColor(embedSettings.color)

        await interaction.reply({ embeds: [embed], components: [help_menu], ephemeral: true });

    }
};
