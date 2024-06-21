const { ChannelType, Message, EmbedBuilder } = require("discord.js");
const config = require("../../config");
const { embedSettings } = require("../../config");
const { log } = require("../../functions");
const GuildSchema = require("../../schemas/GuildSchema");
const ExtendedClient = require("../../class/ExtendedClient");

const cooldown = new Map();

module.exports = {
    event: "messageCreate",
    /**
     *
     * @param {ExtendedClient} client
     * @param {Message<true>} message
     * @returns
     */
    run: async (client, message) => {

        if (message.author.bot || message.channel.type === ChannelType.DM) return;

        /*const embed = new EmbedBuilder()
        .setTitle("Discover - Normas")
        .setDescription(`Estas son las normas oficiales del servidor, uniéndote aceptas cumplir las normas. Si incumples alguna de estas normas serás sancionado.
        
        1️⃣ **Respeto**
        Trata a todos los miembros con cortesía y consideración.

        2️⃣ **Spam**
        Evita el envío excesivo de mensajes, enlaces o imágenes.

        3️⃣ **Contenidos**
        No compartas material ofensivo, inapropiado o ilegal.

        4️⃣ **Acoso**
        Cualquier forma de acoso, bullying o discriminación no será tolerada.

        5️⃣ **Canales**
        Respeta las normas específicas de cada canal.

        6️⃣ **Privacidad**
        Respeta la privacidad de los demás y evita compartir información personal.
        `)
        .setColor(embedSettings.color)*/

        /*const embed = new EmbedBuilder()
        .setTitle("Discover - Primeros Pasos")
        .setDescription(`Este canal se rellenará en futuras actualizaciones...`)
        .setColor(embedSettings.color)*/

        //return message.channel.send({ embeds: [embed] })

        if (!config.handler.commands.prefix) return;

        let prefix = config.handler.prefix;

        if (config.handler?.mongodb?.enabled) {
            try {
                const guildData = await GuildSchema.findOne({ guild: message.guildId });

                if (guildData && guildData?.prefix) prefix = guildData.prefix;
            } catch {
                prefix = config.handler.prefix;
            }
        }

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandInput = args.shift().toLowerCase();

        if (!commandInput.length) return;

        let command =
            client.collection.prefixcommands.get(commandInput) ||
            client.collection.prefixcommands.get(
                client.collection.aliases.get(commandInput)
            );

        if (command) {
            try {
                if (command.structure?.ownerOnly) {
                    if (message.author.id !== config.users.ownerId) {
                        await message.reply({
                            content:
                                config.messageSettings.ownerMessage !== undefined &&
                                    config.messageSettings.ownerMessage !== null &&
                                    config.messageSettings.ownerMessage !== ""
                                    ? config.messageSettings.ownerMessage
                                    : "The bot developer has the only permissions to use this command.",
                            ephemeral: true
                        });

                        return;
                    }
                }

                if (
                    command.structure?.permissions &&
                    !message.member.permissions.has(command.structure?.permissions)
                ) {
                    await message.reply({
                        content:
                            config.messageSettings.notHasPermissionMessage !== undefined &&
                                config.messageSettings.notHasPermissionMessage !== null &&
                                config.messageSettings.notHasPermissionMessage !== ""
                                ? config.messageSettings.notHasPermissionMessage
                                : "You do not have the permission to use this command.",
                        ephemeral: true
                    });

                    return;
                }

                if (command.structure?.developers) {
                    if (!config.users.developers.includes(message.author.id)) {
                        await message.reply({
                            content:
                                config.messageSettings.developerMessage !== undefined &&
                                    config.messageSettings.developerMessage !== null &&
                                    config.messageSettings.developerMessage !== ""
                                    ? config.messageSettings.developerMessage
                                    : "You are not authorized to use this command",
                            ephemeral: true
                        });

                        return;
                    }
                }

                if (command.structure?.nsfw && !message.channel.nsfw) {
                    await message.reply({
                        content:
                            config.messageSettings.nsfwMessage !== undefined &&
                                config.messageSettings.nsfwMessage !== null &&
                                config.messageSettings.nsfwMessage !== ""
                                ? config.messageSettings.nsfwMessage
                                : "The current channel is not a NSFW channel.",
                        ephemeral: true
                    });

                    return;
                }

                if (command.structure?.cooldown) {
                    const cooldownFunction = () => {
                        let data = cooldown.get(message.author.id);

                        data.push(commandInput);

                        cooldown.set(message.author.id, data);

                        setTimeout(() => {
                            let data = cooldown.get(message.author.id);

                            data = data.filter((v) => v !== commandInput);

                            if (data.length <= 0) {
                                cooldown.delete(message.author.id);
                            } else {
                                cooldown.set(message.author.id, data);
                            }
                        }, command.structure?.cooldown);
                    };

                    if (cooldown.has(message.author.id)) {
                        let data = cooldown.get(message.author.id);

                        if (data.some((v) => v === commandInput)) {
                            await message.reply({
                                content:
                                    (config.messageSettings.cooldownMessage !== undefined &&
                                        config.messageSettings.cooldownMessage !== null &&
                                        config.messageSettings.cooldownMessage !== ""
                                        ? config.messageSettings.cooldownMessage
                                        : "Slow down buddy! You're too fast to use this command ({cooldown}s).").replace(/{cooldown}/g, command.structure.cooldown / 1000),
                                ephemeral: true
                            });

                            return;
                        } else {
                            cooldownFunction();
                        }
                    } else {
                        cooldown.set(message.author.id, [commandInput]);

                        cooldownFunction();
                    }
                }

                command.run(client, message, args);
            } catch (error) {
                log(error, "err");
            }
        }
    },
};
