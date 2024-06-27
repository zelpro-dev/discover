const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");
const { embedSettings } = require("../../../config")
const GuildSchema = require("../../../schemas/GuildSchema");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Cambia el enlace de invitación a este canal"),
  options: {
    cooldown: 5000,
    permissions: PermissionFlagsBits.Administrator,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    const guild = await GuildSchema.findOne({ guildID: interaction.guild.id })
    if (!guild) return interaction.reply({ content: "⚠️ Este servidor no está en GrowUp.", ephemeral: true })

    if (interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: "⚠️ No eres el dueño del servidor.", ephemeral: true })

    const ownerId = interaction.guild.ownerId
    if (interaction.user.id !== ownerId) return interaction.update({ content: `⚠️ No eres el dueño de este servidor` })

    const invite = await interaction.channel.createInvite({ maxUses: 0, maxAge: 0 }).catch(error => { console.error('Error:', error.message); });

    guild.invite = invite
    await guild.save()

    const embed = new EmbedBuilder()
      .setDescription(`Se ha generado una nueva invitación para <#${interaction.channel.id}>`)
      .setColor(embedSettings.color)

    const invite_button = new ButtonBuilder()
      .setURL(invite.url)
      .setLabel(invite.url)
      .setStyle(ButtonStyle.Link)

    const button = new ActionRowBuilder()
      .addComponents(invite_button);

    interaction.reply({ embeds: [embed], components: [button], ephemeral: true });

  },
};
