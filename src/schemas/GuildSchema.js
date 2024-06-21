const { model, Schema } = require('mongoose');
const moment = require('moment-timezone');

const ReviewSchema = new Schema({
    userID: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String },
    createdAt: { type: String, required: true, default: new Date() }
});

const GuildSchema = new Schema({
    guildID: { type: String, unique: true, required: true },
    descripcion: { type: String, required: true },
    invite: { type: String, required: true },
    reviews: { type: [ReviewSchema], default: [] },
    solicitud: { type: String, required: true, default: "pendiente" },
    lastBoost: { type: String, required: true, default: new Date().toISOString() },
    createdAt: { type: String, required: true, default: new Date() },
});

module.exports = model('GuildSchema', GuildSchema);