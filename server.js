const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)
const amqp = require('amqplib/callback_api')

const { RABBIT_HOST, QUEUE, EXCHANGE, SERVER_PORT } = require('./config')


consumeMessage();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


io.on("connection", (socket) => {
    socket.on("chat message", message => {
        publishMessage(message)
        console.log("Message: " + message)
    })
})


http.listen(SERVER_PORT, () => {
    console.log("Server is running on Port: " + SERVER_PORT)
})



function publishMessage(message) {
    amqp.connect(`amqp://${RABBIT_HOST}`, (connectionError, connection) => {
        if (connectionError) throw connectionError

        connection.createChannel((channelError, channel) => {
            if (channelError) throw channelError

            channel.assertExchange(EXCHANGE, 'fanout', { durable: false })

            channel.publish(EXCHANGE, '', Buffer.from(JSON.stringify(message))) //Routingkey?

            console.log("Sent: %s", JSON.stringify(message))

        })
    })
}


function consumeMessage() {
    amqp.connect(`amqp://${RABBIT_HOST}`, (connectionError, connection) => {
        if (connectionError) throw connectionError

        connection.createChannel((channelError, channel) => {
            if (channelError) throw channelError

            channel.assertExchange(EXCHANGE, 'fanout', { durable: false })

            channel.assertQueue(QUEUE, { exclusive: false })

            channel.bindQueue(QUEUE, EXCHANGE, 'fanout')

            channel.consume(QUEUE, (message) => {
                message = JSON.parse(message.content)
                console.log("Consumed: %s", message)
                io.emit('chat message', message)


            }, { noAck: true })
        })
    })

}




