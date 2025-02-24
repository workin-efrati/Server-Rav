const qaController = require('../DL/qa.controller')

async function createMessages(data) {
    return await qaController.create(data);
}

async function getMessages(filter, query = {}) {
    const { from, to, limit } = filter;
    
    const start = from ? new Date(new Date(from).setHours(8, 0, 0, 0)) : null;
    let end;

    if (to) {
        end = new Date(new Date(to).setHours(23, 0, 0, 0));
    } else if (start) {
        end = new Date(start);
        end.setDate(end.getDate() + 1);
        end.setHours(23, 0, 0, 0);
    } else {
        end = null;
    }
    if (start) query.date = { $gte: start };
    if (end) query.date = { ...query.date, $lt: end };
    return await qaController.read(query, limit)
}

async function getNumberOfMatches(filter) {
    let query = {}
    // query.isQuestion = true
    let data = await getMessages(filter, query)
    return data.length
}

async function getOneMessage(filter) {
    return await qaController.readOne(filter);
}

async function updateMessage(filter, newData) {
    return await qaController.update(filter, newData);
}

async function deleteMessage(filter) {
    return await qaController.del(filter);
}

module.exports = {
    createMessages,
    getNumberOfMatches,
    getMessages,
    getOneMessage,
    updateMessage,
    deleteMessage
}