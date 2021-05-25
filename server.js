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
    console.log("User connected: " + user)
    res.sendFile(__dirname + "/index.html")
})


io.on("connection", (socket) => {
    socket.on("chat message", message => {
        publishMessage(message)
        console.log("Message: " + message + ". From user: " + user)
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

            var payload = { "user": user, "message": message };
            channel.publish(EXCHANGE, KEY, Buffer.from(JSON.stringify(payload)))

            console.log("Sent: " + JSON.stringify(payload))

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

            channel.consume(QUEUE, (payload) => {
                payload = JSON.parse(payload.content)
                console.log("Consumed: " + JSON.stringify(payload) + ". Key: " + KEY)

                if (payload.user != null) {
                    io.emit('chat message', payload.user + ": " + payload.message)
                }

            }, { noAck: true })
        })
    })

}

module.exports = {app}
