const { StringSelectMenuInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const config = require("../../config");
const { embedSettings } = require("../../config")

module.exports = {
    customId: 'module-menu',
    /**
     * @param {ExtendedClient} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {

        function setup(modules, interaction) {

            // Bienvenidas
            if (modules.join(" ").includes('bienvenida')) {
                interaction.channel.send({ content: "a" })
            }

        }

        const modules = interaction.values;

        const choosed_modules = modules.map((module, index) => {
            if (module === "bienvenidas") return `➜ Bienvenidas 🛬`
            if (module === "despedidas") return `➜ Despedidas 🛫`
            if (module === "verificacion") return `➜ Verificación 🔒`
            if (module === "tickets") return `➜ Tickets 🎫`
            if (module === "autoroles") return `➜ Autoroles 🎭`
            if (module === "sorteos") return `➜ Sorteos 🎉`
            if (module === "sugerencias") return `➜ Sugerencias 💡`
            if (module === "automod") return `➜ Automod ⚒️`
        }).join('\n');

        const embed = new EmbedBuilder()
            .setTitle("Módulos escogidos")
            .setDescription(choosed_modules)
            .setColor(embedSettings.color)

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('continuar')
                    .setLabel('Continuar')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cancelar')
                    .setLabel('Cancelar')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.update({ embeds: [embed], components: [buttons] });

        const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30_000 });

        collector.on('collect', i => {
            if (i.user.id === interaction.user.id) {

                switch (i.customId) {
                    case 'continuar':
                        setup(modules, interaction)
                        break;
                    case 'cancelar':
                        embed.setDescription(`Cancelado con éxito ✅`)
                        buttons.components.forEach(button => { button.setDisabled(true); });

                        i.deferUpdate()
                        interaction.editReply({ embeds: [embed], components: [buttons] }).catch(console.error);
                        collector.stop()
                        break;
                    default:
                        i.reply({ content: "Hubo un error pulsando ese botón ⚠️", ephemeral: true })
                        collector.stop()
                }

            } else {
                i.reply({ content: `No puedes pulsar el botón! ⚠️`, ephemeral: true });
            }
        });

        collector.on('end', collected => {
            if (collected.size < 1) {

                embed.setDescription(`Se ha acabado el tiempo para escoger. ⌛`)
                buttons.components.forEach(button => { button.setDisabled(true); });

                interaction.editReply({ embeds: [embed], components: [buttons] }).catch(console.error);
            }
        });

    }
};
