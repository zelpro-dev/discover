const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require("discord.js");
const ExtendedClient = require('../../class/ExtendedClient');
const config = require("../../config");
const { embedSettings } = require("../../config")
const GuildSchema = require('../../schemas/GuildSchema');
const moment = require('moment-timezone');

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
        if (!guild) return interaction.reply({ content: "⚠️ Este servidor no forma parte de GrowUp.", ephemeral: true })
        if (!guildInfo.ownerId) return interaction.reply({ content: "⚠️ No he encontrado al dueño del servidor.", ephemeral: true })
        if (!owner) return interaction.reply({ content: "⚠️ No he encontrado al dueño del servidor.", ephemeral: true })
        if (guild.solicitud !== "pendiente") return interaction.reply({ content: "⚠️ El servidor ya no está en pendiente.", ephemeral: true })

        guild.lastBoost = new Date().toISOString()
        guild.solicitud = "aceptada"
        await guild.save()

        const embed = new EmbedBuilder()
            .setTitle("¡Enhorabuena!")
            .setDescription(`La solicitud de su servidor **${guildInfo.name}** para formar parte de GrowUp ha sido aceptada. Ahora su servidor es visible desde el comando **/discover**, los servidores se ordenan según su último boost. Para boostear cualquier servidor utiliza **/boost**.`)
            .setColor(embedSettings.color)

        const aceptado = new ButtonBuilder()
            .setCustomId(`aceptado`)
            .setLabel('Aceptado')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)

        const button = new ActionRowBuilder()
            .addComponents(aceptado);

        owner.send({ embeds: [embed] })
        await interaction.update({ components: [button] }).catch(console.error);

    }
};