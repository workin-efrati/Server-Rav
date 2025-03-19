import { whatsappMessagesModel } from "./message.model.js"

export const create = async (message) => await whatsappMessagesModel.create(message)
// export const read = async (filter) => await whatsappMessagesModel.find(filter).sort({ date: 1 })
export const read = async (filter, {select,sort=1, limit}={}) => await whatsappMessagesModel.find(filter).sort({ date: sort }).limit(limit).select(select)
export const readOne = async (filter) => await whatsappMessagesModel.findOne(filter)
export const update = (id, data) => whatsappMessagesModel.findByIdAndUpdate({ _id: id }, data, { new: true })
export const del = (id) => whatsappMessagesModel.deleteOne({ _id: id })

export default {create,read,readOne,update,del}