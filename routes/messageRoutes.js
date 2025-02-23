const express = require('express'),
    router = express.Router(),
    messageService = require('../BL/message.service');

router.get('/', async (req, res) => {
    try {
        const { from, to, limit } = req.query
        // const { from, to, limit } = req.body
        const msgs = await messageService.getMessages({from, to, limit});
        res.send(msgs);

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "something went wrong" });
    }
});

router.get('/length', async (req, res) => {
    try {
        const { from, to } = req.query
        const numOfMsgs = await messageService.getNumberOfQuestions({from, to});
        res.send(numOfMsgs);

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "something went wrong" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const msg = await messageService.getOneMessage({ _id: req.params.id })
        res.send(msg)

    } catch (error) {
        res.status(400).send({ message: "something went wrong" })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const msg = await messageService.updateMessage({ _id: req.params.id }, req.query)
        res.send(msg)

    } catch (error) {
        res.status(400).send({ message: "something went wrong" })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await messageService.deleteMessage({ _id: req.params.id })
        res.send('The message was successfully deleted')

    } catch (error) {
        res.status(400).send({ message: "something went wrong" })
    }
})

module.exports = router