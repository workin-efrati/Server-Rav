import { log } from 'console'
import messageDB from './message.controller.js'
import shutDB from '../shut/shut.controller.js'

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

    const { startOfDay, endOfDay } = new Date(date).startEnd();
    let messages = await messageDB.read({ date: { $gte: startOfDay, $lte: endOfDay }, isActive: true , isFuq: { $exists: false } })

    return messages;
}

async function getNumberOfQuestions(from, to) {
    const { startOfDay } = new Date(from).startEnd();
    const { endOfDay } = new Date(to).startEnd();
    let data = await messageDB.read({ date: { $gte: startOfDay, $lte: endOfDay }, isQuestion: true }, { _id: 1, date: 1, isActive: 1 })
    let isYear = startOfDay.getMonth() !== endOfDay.getMonth()
    let arrLength = isYear ? 13 : 32
    let questionNumArr = Array(arrLength).fill({ total: 0, part: 0 });

    for (let d of data) {
        let day = isYear ? d.date.getMonth() : d.date.getDate()
        let curTotal = questionNumArr[day].total
        questionNumArr[day] = { ...questionNumArr[day], total: curTotal + 1 }
        if (!d.isActive) {
            let curPart = questionNumArr[day].part
            questionNumArr[day] = { ...questionNumArr[day], part: curPart + 1 }
        }
    }
    return questionNumArr
}

async function getFuqs(date, sender) {
    const { startOfDay, endOfDay } = date.startEnd();

    return await messageDB.read({ date: { $gte: startOfDay, $lte: endOfDay }, sender, isFuq: true })
}

async function getFullMsgs(_id, params) {
    const {time =1 , isQuestion} = params
    let msg = await getSingleMessage(_id)
    if (!msg) return {}

    let { sender, date, isFuq } = msg

    let filter = {}

    if (isFuq) {
        let fuqs = await getFuqs(date, sender)
        let start = fuqs[0].date, end = fuqs[fuqs.length - 1].date;
        filter = {
            date: { $gte: Number(start), $lte: Number(end) + ((30 * time) * 60 * 1000) },
            $or: [
                { sender },
                { sender: { $exists: false } },
                { $and: [ {sender: 'ברוך אפרתי' } ,{ isQuestion: false } ]}
            ]
        }
        if(isQuestion) filter.isQuestion= false
        return await messageDB.read(filter);
    }

    filter = {
        $or: [
            { _id },
            {
                $and: [
                    { date: { $gte: Number(date), $lte: Number(date) + ((30 * time) * 60 * 1000) } },
                    { isQuestion: false },
                    { isActive: true }
                ]
            }]
    }

    let messages = await messageDB.read(filter)

    return messages
}

async function getNavMsg(_id, isNext = true) {

    let msg = await getSingleMessage(_id)
    if (!msg) return {}
    const date = msg.date
    const { startOfDay, endOfDay } = new Date(date).startEnd();
    let message = await messageDB.read({
        date: { $gte: isNext ? Number(new Date(date)) : startOfDay, $lte: isNext ? endOfDay : Number(new Date(date)) },
        isQuestion: true,
        isActive: true,
        $or: [{ isFuq: { $exists: false } }, { isFuq: false }],
        _id: { $ne: _id }
    }, { select: '_id', sort: isNext ? 1 : -1, limit: 1 })

    return message[0]?._id
}

async function saveMessages(data) {
    const { qId, aId } = data
    if (!data || !qId || !aId) throw "data is empty"
    const updateDocs = []

    let q = await getSingleMessage(qId)
    let a = await getSingleMessage(aId)

    updateDocs.push(q, a);

    let shut = {
        date: q.date,
        question: q.message,
        answer: a.message,
        messagesId: [qId, aId],
    }


    for (let f of data.fuq || []) {
        if (!shut.fuqs) shut.fuqs = []

        let qq = await getSingleMessage(f.qId)
        let aa = await getSingleMessage(f.aId)

        updateDocs.push(qq, aa);

        shut.fuqs.push({
            question: qq.message,
            answer: aa.message,
        })
    };

    let result = await shutDB.create(shut);

    if (result) {
        updateDocs.forEach(u => {
            u.isActive = false
            u.save()
        })
    }

    return result
}

async function updateMessage(_id, newData) {
    return await messageDB.update(_id, newData);
}

async function deleteMessage(ids=[]) {
    if(!ids) throw 'ids is not array'
    for(let id of ids){
        await messageDB.del(id);
    }
}


export default {
    getSingleMessage, getMessagesByDate, getNumberOfQuestions,
    saveMessages, firstFuq, getFuqs, getFullMsgs, updateMessage, deleteMessage,
    getNavMsg
}


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