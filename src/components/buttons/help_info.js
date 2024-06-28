const { ButtonInteraction, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const config = require("../../config");
const { embedSettings } = require("../../config")

module.exports = {
    customId: 'help_info',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {

        const discover = new ButtonBuilder()
            .setCustomId(`help_discover`)
            .setLabel('Discover')
            .setDisabled(false)
            .setStyle(ButtonStyle.Primary);

        const info = new ButtonBuilder()
            .setCustomId(`help_info`)
            .setLabel('Información')
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary);

        const help_menu = new ActionRowBuilder()
            .addComponents(discover, info);

        const embed = new EmbedBuilder()
            .setTitle('Información')
            .setDescription(`
📡 ` + "`" + "/ping" + "`" + `
Revisa la latencia y otras estadísticas del bot.

🌐 ` + "`" + "/soporte" + "`" + `
Te muestra el enlace del servidor de soporte oficial.

🆘 ` + "`" + "/help" + "`" + `
Es este comando...
`)
            .setColor(embedSettings.color)

        await interaction.update({ embeds: [embed], components: [help_menu] })

    }
};