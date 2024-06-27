const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require("discord.js");
const ExtendedClient = require('../../class/ExtendedClient');
const config = require("../../config");
const { embedSettings } = require("../../config")
const GuildSchema = require('../../schemas/GuildSchema');

module.exports = {
    customId: 'rechazar_servidor',
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
        if (!guild) return interaction.reply({ content: "⚠️ Este servidor no forma parte de GrowUp.", ephemeral: true })
        if (!guildInfo.ownerId) return interaction.reply({ content: "⚠️ No he encontrado al dueño del servidor.", ephemeral: true })
        if (!owner) return interaction.reply({ content: "⚠️ No he encontrado al dueño del servidor.", ephemeral: true })
        if (guild.solicitud !== "pendiente") return interaction.reply({ content: "⚠️ El servidor ya no está en pendiente.", ephemeral: true })

        guild.solicitud = "rechazada"
        await guild.save()

        const embed = new EmbedBuilder()
            .setTitle("Lo sentimos")
            .setDescription(`La solicitud de su servidor **${guildInfo.name}** para formar parte de GrowUp ha sido rechazada. Si tiene alguna duda de porque, únase al servidor de soporte.`)
            .setColor(embedSettings.color)

        const rechazado = new ButtonBuilder()
            .setCustomId(`rechazado`)
            .setLabel('Rechazado')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)

        const button = new ActionRowBuilder()
            .addComponents(rechazado);

        const soporte = new ButtonBuilder()
            .setURL("https://dsc.gg/growup-soporte")
            .setLabel('Servidor de Soporte')
            .setStyle(ButtonStyle.Link);

        const button2 = new ActionRowBuilder()
            .addComponents(soporte);

        owner.send({ embeds: [embed], components: [button2] })
        await interaction.update({ components: [button] }).catch(console.error);

    }
};