import mongoose from 'mongoose';

const whatsappMessageSchema = new mongoose.Schema({
    date: { type: Date, required: true,default:Date.now },
    sender: { type: String },
    message: { type: String, required: true },
    isQuestion: { type: Boolean, required: true },
    isUnknown: { type: Boolean },
    isFuq: { type: Boolean },
    rId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'whatsappmsg'
    },
    isActive: { type: Boolean, default:true },

}, { timestamps: true });

export const whatsappMessagesModel = mongoose.model('whatsappmsg', whatsappMessageSchema)