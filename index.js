const express = require('express'),
    app = express(),
    PORT = 2500,
    cors = require('cors'),
    messageRoutes = require('./routes/messageRoutes'),
    editedQaRoutes = require('./routes/qaRoutes');


app.use(cors())
app.use(express.json())

const db = require('./DL/db')
db.connect()

app.use('/messages', messageRoutes);
// app.use('/qa', editedQaRoutes);


app.listen(PORT, () => console.log(`#### Server is up in port ${PORT} ####`))