import { log } from 'console'
import messageDB from './message.controller.js'

Date.prototype.startEnd = function () {
    const targetDate = new Date(this);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    return { startOfDay, endOfDay }
}

async function getSingleMessage(_id) {
    return await messageDB.readOne({ _id })
}

async function getMessagesByDate(date) {
    if (!date) return []

    const { startOfDay, endOfDay } = date.startEnd();
    let messages = await messageDB.read({ date: { $gte: startOfDay, $lte: endOfDay } })
    return messages;
}

async function getNumberOfQuestions(filter) {
    const { from, to } = filter;

    const { startOfDay } = from.startEnd();
    const { endOfDay } = to.startEnd();
    let data = await messageDB.read({ date: { $gte: startOfDay, $lte: endOfDay }, isQuestion: true }, { _id: 1, date: 1 })
    let isYear = startOfDay.getMonth() !== endOfDay.getMonth()
    let questionNumArr = []
    // let questionNumArr = isYear ? Array(13).fill(0) : Array(32).fill(0);

    for(let d of data) {
        let day = isYear ? d.date.getMonth() : d.date.getDate()
        questionNumArr[day]++
    }
    return questionNumArr
}

async function getFuqs(date, sender) {
    const { startOfDay, endOfDay } = date.startEnd();

    return await messageDB.read({ date: { $gte: startOfDay, $lte: endOfDay }, sender, isFuq: true })
}

async function getFullMsgs(_id) {
    let msg = await getSingleMessage(_id)
    if (!msg) return {}

    let { sender, date, isFuq } = msg
    let start = date, end = date
    if(isFuq) {
        let fuqs = await getFuqs(date, sender)
        start = fuqs[0].date, end = fuqs[fuqs.length - 1].date
    }

    let messages = await messageDB.read({
        date: { $gte: start, $lte: new Date(end.setMinutes(end.getMinutes() + 90)) },
        $or: [
            { sender },
            { sender: { $exists: false } }
        ]
    })

    return messages
}

async function updateMessage(_id, newData) {
    return await messageDB.update({_id}, newData);
}

async function deleteMessage(_id) {
    return await messageDB.del({_id});
}


export default { getSingleMessage, getMessagesByDate, getNumberOfQuestions, firstFuq, getFuqs, getFullMsgs, updateMessage, deleteMessage }


async function firstFuq(date) {
    let fuq = await getFuqs(date);

    const grouped = fuq.reduce((acc, msg) => {

        const shortDate = msg.date.toISOString().split('T')[0];
        if (!acc[shortDate]) acc[shortDate] = {};
        if (!acc[shortDate][msg.sender]) acc[shortDate][msg.sender] = [];

        acc[shortDate][msg.sender].push({
            _id: msg._id,
            date: msg.date,
            message: msg.message,
            isFuq: msg.isFuq,
            isQuestion: msg.isQuestion,
        });

        return acc;
    }, {});

    const result = {}
    Object.entries(grouped).forEach(([x, senders]) => {
        Object.entries(senders)
            // .filter(([s, m]) => m.length >= 2)
            .forEach(h => {
                if (!result[x]) result[x] = []
                result[x].push({ sender: h[0], ...h[1][0], fuqs: h[1].length })
            })
    })

    return result;
}