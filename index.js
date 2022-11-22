const { PORT = 3000 } = process.env
const express = require('express')
const cors = require('cors')
const server = express()
server.use(cors())
const morgan = require('morgan')
server.use(morgan('dev'))

server.use(express.json())

const apiRouter =("./api")
server.use('/api', apiRouter)

server.use((req, res, next)=>{
    console.log("Body Logger Start------")
    console.log(req.body)
    console.log("Body Logger End-------")

    next()
})

const {client} = require('./db')
// const {application} = require('express')
client.connect()

server.listen(PORT, ()=>{
    console.log("The server is up on port", PORT)
})