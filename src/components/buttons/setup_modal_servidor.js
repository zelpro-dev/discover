const { ButtonInteraction, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const config = require("../../config");
const { embedSettings } = require("../../config")

module.exports = {
    customId: 'setup_modal_servidor',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {

        const ownerId = interaction.guild.ownerId
        if (interaction.user.id !== ownerId) return interaction.reply({ content: `⚠️ No eres el dueño de este servidor`, ephemeral: true })

        const setup_server = new ModalBuilder()
            .setCustomId('setup_server')
            .setTitle('Discover - Setup');

        const descripcion = new TextInputBuilder()
            .setCustomId('descripcion')
            .setLabel("Cuentanos, ¿qué se hace en tu servidor?")
            .setStyle(TextInputStyle.Paragraph);

        // TODO: Poner un mínimo e igual máximo de carácteres

        const firstRow = new ActionRowBuilder().addComponents(descripcion);

        setup_server.addComponents(firstRow);

        await interaction.showModal(setup_server);

    }
};