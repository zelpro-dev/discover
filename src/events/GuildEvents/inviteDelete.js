const config = require('../../config');
const ExtendedClient = require('../../class/ExtendedClient');
const { EmbedBuilder } = require('discord.js');
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

        const new_invite = await invite.channel.createInvite({
            maxUses: 0,
            maxAge: 0
        }).catch(error => { console.error('Error:', error.message); });

        guild.invite = new_invite
        await guild.save()

        const embed = new EmbedBuilder()
            .setTitle("Alerta")
            .setDescription(`Hola, venía a decirte que se ha borrado la invitación: ${invite.url} de ${invite.guild.name}. He generado otra para que los usuarios se puedan seguir uniendo.\n\n🚩 ${new_invite.url}`)
            .setColor(embedSettings.color)
            .setFooter({ text: `Discover - Alerta`, iconURL: embedSettings.icon })

        const owner = client.users.cache.get(invite.guild.ownerId).send({ embeds: [embed] })

    }
};