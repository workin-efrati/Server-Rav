const editedQaModel = require('./qa.model')

async function create(data) {
    return await editedQaModel.create(data);
}

async function read(filter, limit) {
    return result = await editedQaModel.find(filter).limit(limit);
}

async function readOne(filter) {
    return await editedQaModel.findOne(filter);
}

async function update(filter, newData) {
    return await editedQaModel.findOneAndUpdate(filter, newData);
}

async function del(filter) {
    return await editedQaModel.findOneAndDelete(filter);
}


module.exports = {
    create,
    read,
    readOne,
    update,
    del
};