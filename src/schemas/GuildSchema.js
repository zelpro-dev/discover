const { model, Schema } = require('mongoose');
const moment = require('moment-timezone');

module.exports = model('GuildSchema',
    new Schema({
        guildID: { type: String, required: true },
        descripcion: { type: String, required: true },
        invite: { type: String, required: true },
        solicitud: { type: String, required: true, default: "pendiente" },
        lastBoost: { type: String, required: true, default: new Date() },
        createdAt: { type: String, required: true, default: new Date() }
    })
);