const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)
const amqp = require('amqplib/callback_api')
const { auth } = require('express-openid-connect')
var user;

const { RABBIT_HOST, QUEUE, EXCHANGE, KEY, SERVER_PORT,
        ISSUER_BASE_URL, CLIENT_ID, BASE_URL, SECRET } = require('./config')

app.use(
    auth({
        issuerBaseURL: ISSUER_BASE_URL,
        baseURL: BASE_URL,
        clientID: CLIENT_ID,
        secret: SECRET,
        idpLogout: true
    })
)

app.get("/", (req, res) => {
    user = req.oidc.user.nickname
    res.sendFile(__dirname + "/index.html")
})


io.on("connection", (socket) => {
    socket.on("chat message", message => {
        publishMessage(message)
        console.log("Message: " + message + "From user: " + user)
    })
})


http.listen(SERVER_PORT, () => {
    console.log("Server is running on Port: " + SERVER_PORT)
})


consumeMessage();


function publishMessage(message) {
    amqp.connect(`amqp://${RABBIT_HOST}`, (connectionError, connection) => {
        if (connectionError) throw connectionError

        connection.createChannel((channelError, channel) => {
            if (channelError) throw channelError

            channel.assertExchange(EXCHANGE, 'direct', { durable: false })

            channel.publish(EXCHANGE, KEY, Buffer.from(JSON.stringify(message)))

            console.log("Sent: " + JSON.stringify(message))

        })
    })
}


function consumeMessage() {
    amqp.connect(`amqp://${RABBIT_HOST}`, (connectionError, connection) => {
        if (connectionError) throw connectionError

        connection.createChannel((channelError, channel) => {
            if (channelError) throw channelError

            channel.assertExchange(EXCHANGE, 'direct', { durable: false })

            channel.assertQueue(QUEUE, { exclusive: true })

            channel.bindQueue(QUEUE, EXCHANGE, KEY)

            channel.consume(QUEUE, (message) => {
                message = JSON.parse(message.content)
                console.log("Consumed: " + message + "Key: " + KEY)
                io.emit('chat message', user + ": " + message)

            }, { noAck: true })
        })
    })

}




