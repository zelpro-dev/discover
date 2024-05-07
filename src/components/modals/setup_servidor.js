const { ModalSubmitInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const config = require("../../config");
const { embedSettings } = require("../../config")
const GuildSchema = require('../../schemas/GuildSchema');
const components = require('../../handlers/components');

module.exports = {
  customId: 'setup_server',
  /**
   * 
   * @param {ExtendedClient} client 
   * @param {ModalSubmitInteraction} interaction 
   */
  run: async (client, interaction) => {

    const descripcion = interaction.fields.getTextInputValue('descripcion');

    const guild = await GuildSchema.findOne({ guildID: interaction.guild.id })
    if (guild) return interaction.reply({ content: "⚠️ Este servidor ya está en Discover.", ephemeral: true })

    if (interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: "⚠️ No eres el dueño del servidor.", ephemeral: true })

    const requestServer = config.channels.servidor

    const invite = await interaction.channel.createInvite({ maxUses: 0, maxAge: 0 }).catch(error => { console.error('Error:', error.message); });

    const embed = new EmbedBuilder()
      .setTitle("Nueva Solicitud")
      .setDescription(`> **Guild:** ${interaction.guild.name} *(${interaction.guild.id})*\n> **Descripción:** ${descripcion}\n> **Invite:** ${invite.url}`)
      .setColor(embedSettings.color)
      .setFooter({ text: `Discover - Solicitudes`, iconURL: embedSettings.icon })

    const aceptar = new ButtonBuilder()
      .setCustomId(`aceptar_servidor`)
      .setLabel('Aceptar')
      .setStyle(ButtonStyle.Success);

    const rechazar = new ButtonBuilder()
      .setCustomId(`rechazar_servidor`)
      .setLabel('Rechazar')
      .setStyle(ButtonStyle.Danger);

    const id = new ButtonBuilder()
      .setCustomId(`${interaction.guild.id}`)
      .setLabel(`${interaction.guild.id}`)
      .setStyle(ButtonStyle.Secondary);

    const buttons = new ActionRowBuilder()
      .addComponents(aceptar, rechazar, id);

    client.channels.cache.get(requestServer).send({ embeds: [embed], components: [buttons] }).catch(error => { console.error('Error:', error.message); });
    
    await GuildSchema.create({ guildID: interaction.guild.id, descripcion: descripcion, invite: invite }).catch(error => { console.error('Error:', error.message); });

    const button = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(invite.url).setURL(invite.url)
    const components = new ActionRowBuilder().addComponents(button)

    const embed2 = new EmbedBuilder()
      .setTitle("Setup")
      .setDescription(`¡Enhorabuena! Has finalizado el setup, ahora tu servidor está en nuestra base de datos esperando para que sea aceptado por nuestro Staff, el bot te avisará si es aceptado, sea paciente! He generado una invitación para que cualquier persona se pueda unir al servidor, es la que se muestra debajo, por favor no la borres en ningún momento.`)
      .setColor(embedSettings.color)
      .setFooter({ text: `Discover - Setup`, iconURL: embedSettings.icon })

    await interaction.update({ embeds: [embed2], components: [components] });

  }
};