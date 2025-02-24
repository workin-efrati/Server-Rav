const whatsappMessagesModel = require('./message.model')

async function create(data) {
    return await whatsappMessagesModel.create(data);
}

async function read({filter, select = null, limit}) {
    return result = await whatsappMessagesModel.find(filter).select(select).limit(limit);
    // async function read(filter, limit) {
    // return result = await whatsappMessagesModel.find(filter).limit(limit);
}

async function readOne(filter) {
    return await whatsappMessagesModel.findOne(filter);
}

async function update(filter, newData) {
    return await whatsappMessagesModel.findOneAndUpdate(filter, newData);
}

async function del(filter) {
    return await whatsappMessagesModel.findOneAndDelete(filter);
}


module.exports = {
    create,
    read,
    readOne,
    update,
    del
};