const config = require('../../config');
const ExtendedClient = require('../../class/ExtendedClient');
const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require("discord.js");
const { time } = require('../../functions');
const { embedSettings } = require("../../config")
const GuildSchema = require('../../schemas/GuildSchema');

module.exports = {
    event: 'inviteDelete',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {import('discord.js').Invite} invite 
     * @returns 
     */
    run: async (client, invite) => {

        const guild = await GuildSchema.findOne({ guildID: invite.guild.id })
        if (!guild) return;

        if (invite.url !== guild.invite) return

        const new_invite = await invite.channel.createInvite({
            maxUses: 0,
            maxAge: 0
        }).catch(error => { console.error('Error:', error.message); });

        guild.invite = new_invite
        await guild.save()

        const embed = new EmbedBuilder()
            .setTitle("Invitación Eliminada")
            .setDescription(`Hola, venía a decirte que se ha borrado la invitación ${invite.url} de ${invite.guild.name}. He generado otra para que los usuarios se puedan seguir uniendo.`)
            .setColor(embedSettings.color)

        const invite_button = new ButtonBuilder()
            .setURL(new_invite.url)
            .setLabel(new_invite.url)
            .setStyle(ButtonStyle.Link)

        const button = new ActionRowBuilder()
            .addComponents(invite_button);

        const owner = client.users.cache.get(invite.guild.ownerId).send({ embeds: [embed], components: [button] })

    }
};