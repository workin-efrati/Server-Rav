import { shutModel } from "./shut.model.js"

export const create = async (data) => await shutModel.create(data)
export const read = async (filter) => await shutModel.find(filter).sort({ date: 1 })
export const readOne = async (filter) => await shutModel.findOne(filter)
export const update = (id, data) => shutModel.findByIdAndUpdate({ _id: id }, data, { new: true })
export const del = (id) => shutModel.deleteOne({ _id: id })

export default {create,read,readOne,update,del}