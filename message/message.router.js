import express from 'express'
import messageService from './message.service.js'
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const result = await messageService.saveMessages(req.body)
        res.send(result)

    } catch (error) {
        res.status(400).send(error.message || 'error')
    }
})

router.get('/', async (req, res) => {
    try {
        const { date } = req.query
        const msgs = await messageService.getMessagesByDate(date)
        res.send(msgs);

    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || 'error')
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
        const msg = await messageService.getFullMsgs(req.params.id, req.query)
        res.send(msg);

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "something went wrong" });
    }
});

router.get('/:id/nav', async (req, res) => {
    try {
        const {nav} = req.query, id=req.params.id;
        const msg = await messageService.getNavMsg(id,nav==1)
        res.send(msg);

    } catch (error) {
        console.error(error);
        res.status(400).send(error);
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
        
        const msg = await messageService.updateMessage(req.params.id, req.body)
        res.send(msg)

    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || 'error')
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await messageService.deleteMessage(req.params.id)
        res.send(true)

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "something went wrong" })
    }
})

router.delete('/', async (req, res) => {
    try {
        await messageService.deleteMessage(req.body)
        res.send(true)

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "something went wrong" })
    }
})

export default router