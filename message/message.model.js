import mongoose from 'mongoose';

const whatsappMessageSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    sender: { type: String },
    message: { type: String, required: true },
    isQuestion: { type: Boolean, required: true },
    isUnknown: { type: Boolean},
    isFuq: { type: Boolean},

}, { timestamps: true });

export const whatsappMessagesModel = mongoose.model('whatsappmsg', whatsappMessageSchema)