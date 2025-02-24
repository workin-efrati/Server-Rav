const messageController = require('../DL/message.controller')

async function createMessages(data) {
    return await messageController.create(data);
}

async function getMessages(filter, select = null, query = {}) {
    const { from, to, limit } = filter;

    const dates = filterDates(from, to)
    if (dates.start) query.date = { $gte: dates.start };
    if (dates.end) query.date = { ...query.date, $lt: dates.end };
    return await messageController.read({ filter: query, limit, select })
}

async function getNumberOfQuestions(filter) {
    const { from, to } = filter;
    let query = {}
    let select = { _id: 1, date: 1 }
    query.isQuestion = true
    let data = await getMessages(filter, select, query)
    let isYear = from[5]+from[6] !== to[5]+to[6]
    let questionNumArr = isYear ? Array(13).fill(0) : Array(32).fill(0);

    for(let d of data) {
        let day = isYear ? d.date.getMonth() : d.date.getDate()
        questionNumArr[day]++
    }
    return questionNumArr
}

async function getOneMessage(filter) {
    return await messageController.readOne(filter);
}

async function updateMessage(filter, newData) {
    return await messageController.update(filter, newData);
}

async function deleteMessage(filter) {
    return await messageController.del(filter);
}

module.exports = {
    createMessages,
    getNumberOfQuestions,
    getMessages,
    getOneMessage,
    updateMessage,
    deleteMessage
}

function filterDates(from, to) {
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

    return { start, end }
}


// let count = 0
    // let j = 0

    // for (let i = 0; i < 31; i++) {
    //     console.log('data[j] ', data[j].date);
    //     let num = data[j].date.getDate()
    //     console.log('num ', data[j].date.getDate());
    //     console.log('num ', num);
    //     while (Number(num) === i + 1) {
    //         console.log('count1 ', count);
    //         count++
    //         console.log('count2 ', count);
    //         j++
    //         if(j === data.length) break
    //         num = data[j].date.getDate()
    //     }
    //     // if (j > 0) j--
    //     console.log('count3 ', count);
    //     questionNumArr.push(count)
    //     count = 0
    // }
    // data.reduce() // create a function that count the numbers of question at year/month