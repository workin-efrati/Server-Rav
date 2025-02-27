import mongoose from 'mongoose';

const shutSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag" }],
    messagesId: [{ type: mongoose.Schema.Types.ObjectId, ref: "whatsappMessage" }],
    isApproved: { type: Boolean, default: false },

}, { timestamps: true });

export const shutModel = mongoose.model('shut', shutSchema)