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

    const embed = new EmbedBuilder()
      .setTitle("New Server Request")
      .setDescription(`**Guild:** ${interaction.guild.name} *(${interaction.guild.id})*\n**Descripción:** ${descripcion}\n\n`)
      .setColor(embedSettings.color)

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

    const invite = await interaction.channel.createInvite({ maxUses: 0, maxAge: 0 }).catch(error => { console.error('Error:', error.message); });
    
    await GuildSchema.create({ guildID: interaction.guild.id, descripcion: descripcion, invite: invite }).catch(error => { console.error('Error:', error.message); });

    const embed2 = new EmbedBuilder()
      .setTitle("Discover - Setup")
      .setDescription(`¡Enhorabuena! Has finalizado el setup, ahora tu servidor está en nuestra base de datos esperando para que sea aceptado por nuestro Staff, el bot te avisará si es aceptado, sea paciente! Recuerda que la invitación no se puede borrar!\n\n🚩 ${invite.url}`)
      .setColor(embedSettings.color)

    await interaction.update({ embeds: [embed2], components: [] });

  }
};