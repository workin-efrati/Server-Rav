import express from 'express'
import messageService from './message.service.js'
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const result = await messageService.saveMessages(req.body)
        res.send(result)

    } catch (error) {
        res.status(400).send(error || "something went wrong" )
    }
})

router.get('/', async (req, res) => {
    try {
        const { date } = req.query
        const msgs = await messageService.getMessagesByDate(date)
        res.send(msgs);

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "something went wrong" });
    }
});

router.get('/amount', async (req, res) => {
    try {
        const { from, to } = req.query
        const numOfMsgs = await messageService.getNumberOfQuestions(from, to);
        res.send(numOfMsgs);

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "something went wrong" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const msg = await messageService.getFullMsgs(req.params.id,req.query.time)
        res.send(msg);

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "something went wrong" });
    }
});

router.get('/fuqs/:date', async (req, res) => {
    try {
        const msg = await messageService.getFuqs(req.params.date)
        res.send(msg);

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "something went wrong" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const msg = await messageService.updateMessage(req.params.id, req.query)
        res.send(msg)

    } catch (error) {
        res.status(400).send({ message: "something went wrong" })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await messageService.deleteMessage(req.params.id)
        res.send(true)

    } catch (error) {
        res.status(400).send({ message: "something went wrong" })
    }
})

export default router