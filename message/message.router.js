import express from 'express'
import messageService from './message.service.js'
const router = express.Router()


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

router.get('/:id', async (req, res) => {
    try {
        const msg = await messageService.getSingleMessage(req.params.id)
        res.send(msg);

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "something went wrong" });
    }
});



router.get('/fuq/:id', async (req, res) => {
    try {
        const msgs = await messageService.getFullFuq(req.params.id)
        res.send(msgs);

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

export default router