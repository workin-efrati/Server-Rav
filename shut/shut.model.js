import mongoose from 'mongoose';

const shutSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    title: { type: String },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag" }],
    date: { type: Date, required: true, default: Date.now },
    messagesId: [{ type: mongoose.Schema.Types.ObjectId, ref: "whatsappMessage_e" }],
    fuqs: [{
        question: { type: String, required: true },
        answer: { type: String, required: true },
    }]
}, { timestamps: true });

export const shutModel = mongoose.model('shut_e', shutSchema)