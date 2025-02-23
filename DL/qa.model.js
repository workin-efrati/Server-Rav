const mongoose = require('mongoose')

const editedQaSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag" }],
    messagesId: [{ type: mongoose.Schema.Types.ObjectId, ref: "whatsappMessage" }],
    isApproved: { type: Boolean, default: false },

}, { timestamps: true });

const editedQaModel = mongoose.model('editedQa', editedQaSchema)

module.exports = editedQaModel