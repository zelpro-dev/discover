const { ButtonInteraction, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const config = require("../../config");
const { embedSettings } = require("../../config")

module.exports = {
    customId: 'help_discover',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {

        const discover = new ButtonBuilder()
            .setCustomId(`help_discover`)
            .setLabel('Discover')
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary);

        const info = new ButtonBuilder()
            .setCustomId(`help_info`)
            .setLabel('Información')
            .setDisabled(false)
            .setStyle(ButtonStyle.Primary);

        const help_menu = new ActionRowBuilder()
            .addComponents(discover, info);

        const embed = new EmbedBuilder()
            .setTitle('Discover')
            .setDescription(`
🔧 ` + "`" + "/setup" + "`" + `
Sirve para configurar el Bot en el servidor y formar parte de GrowUp.

🔎 ` + "`" + "/discover" + "`" + `
Explora todos los servidores registrados.

🚀 ` + "`" + "/boost" + "`" + `
Haz que tu servidor salga antes en la lista de Discover.

⭐️ ` + "`" + "/review" + "`" + `
Deja una reseña en el servidor para compartir tu experiencia en el.

📌 ` + "`" + "/invite" + "`" + `
Cambia el canal de la invitación del servidor.
`)
            .setColor(embedSettings.color)

        await interaction.update({ embeds: [embed], components: [help_menu] })

    }
};