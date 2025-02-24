const mongoose = require('mongoose')

const whatsappMessageSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    sender: { type: String },
    message: { type: String, required: true },
    isQuestion: { type: Boolean, required: true },
    isEdited: { type: Boolean, default: false },

}, { timestamps: true });

const whatsappMessagesModel = mongoose.model('whatsappMessage', whatsappMessageSchema)

module.exports = whatsappMessagesModel