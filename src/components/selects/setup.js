const { StringSelectMenuInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const config = require("../../config");
const { embedSettings } = require("../../config");
const GuildSchema = require('../../schemas/GuildSchema');

module.exports = {
    customId: 'setup',
    /**
     * @param {ExtendedClient} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {

        const guild = await GuildSchema.findOne({ guildID: interaction.guild.id })
        if (guild) return interaction.reply({ content: "⚠️ Este servidor ya está en Discover.", ephemeral: true })
        
        if(interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: "⚠️ No eres el dueño del servidor.", ephemeral: true })

        const value = interaction.values.join(" ")

        switch (value) {
            case "server":
                const ownerId = interaction.guild.ownerId
                if (interaction.user.id !== ownerId) return interaction.update({ content: `⚠️ No eres el dueño de este servidor` })

                const embed_server = new EmbedBuilder()
                    .setTitle("Discover - Servidor")
                    .setDescription(`A continuación verás un botón el cual te mostrará un formulario. Se te pedirá una descripción para tu servidor.\n¡Ten imaginación y escribe algo que te anime a entrar a tu servidor!`)
                    .setColor(embedSettings.color)

                const show_modal = new ButtonBuilder()
                    .setCustomId(`setup_modal_servidor`)
                    .setLabel('Rellenar Formulario')
                    .setEmoji("📃")
                    .setStyle(ButtonStyle.Primary);

                const button = new ActionRowBuilder()
                    .addComponents(show_modal);

                await interaction.update({ embeds: [embed_server], components: [button] })
                break;
            case "bot":
                await interaction.update({ content: "⚠️ Este módulo está en desarrollo...", embeds: [], components: [] })
                break;
        }

    }
};
