const { ButtonInteraction, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const config = require("../../config");
const { embedSettings } = require("../../config")
const GuildSchema = require('../../schemas/GuildSchema');

module.exports = {
    customId: 'aceptar_servidor',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {

        const guildID = interaction.message.components[0].components[2].data.custom_id
        const guild = await GuildSchema.findOne({ guildID: guildID })
        const guildInfo = client.guilds.cache.get(guildID)
        const owner = client.users.cache.get(guildInfo.ownerId)
        if(!guild) return interaction.reply({ content: "⚠️ Este servidor no forma parte de GrowUp.", ephemeral: true })
        if(!guildInfo.ownerId) return interaction.reply({ content: "⚠️ No he encontrado al dueño del servidor.", ephemeral: true })
        if(!owner) return interaction.reply({ content: "⚠️ No he encontrado al dueño del servidor.", ephemeral: true })
        if(guild.solicitud !== "pendiente") return interaction.reply({ content: "⚠️ El servidor ya no está en pendiente.", ephemeral: true })
        
        guild.solicitud = "aceptada"
        await guild.save()

        owner.send({ content: `🎉 Se ha aceptado tu solicitud para el servidor ${guildInfo.name}!` })
        return interaction.reply({ content: "✅ Se ha aceptado la solicitud correctamente!", ephemeral: true })

    }
};