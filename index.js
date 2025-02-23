import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// dotenv.config({ path: '.env' })
dotenv.config()

const app = express(),
    PORT = 2500;

app.use(cors())
app.use(express.json())

import { connect } from './db.js'
connect()

import msgRoutes from './message/message.router.js'
app.use('/msg', msgRoutes);


app.listen(PORT, () => {
    console.log(`#### Server is up in port ${PORT} ####`)

    // console.log('All env vars:', process.env)
})