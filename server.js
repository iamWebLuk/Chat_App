const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const amqp = require("amqplib/callback_api");
const { auth } = require("express-openid-connect");
const fs = require("fs");

const {
  RABBIT_HOST,
  QUEUE,
  EXCHANGE,
  KEY,
  SERVER_PORT,
  ISSUER_BASE_URL,
  CLIENT_ID,
  BASE_URL,
  SECRET,
} = require("./config");

app.use(
  auth({
    issuerBaseURL: ISSUER_BASE_URL,
    baseURL: BASE_URL,
    clientID: CLIENT_ID,
    secret: SECRET,
    idpLogout: true,
  })
);

app.get("/", (req, res) => {
  fs.promises
    .readFile(__dirname + "/index.html")
    .then((html) => {
      var user = req.oidc.user.nickname;
      console.log("User connected: " + user);
      return html.toString().replace("currentUser", JSON.stringify(user));
    })
    .then((html) => res.send(html));
});

io.on("connection", (socket) => {
  socket.on("message", (message) => {
    publishMessage(message);
    console.log("Message: " + message);
  });
});

http.listen(SERVER_PORT, () => {
  console.log("Server is running on Port: " + SERVER_PORT);
});

function publishMessage(payload) {
  amqp.connect(`amqp://${RABBIT_HOST}`, (connectionError, connection) => {
    if (connectionError) throw connectionError;

    connection.createChannel((channelError, channel) => {
      if (channelError) throw channelError;

      channel.assertExchange(EXCHANGE, "direct", {
        durable: false,
      });

      channel.publish(EXCHANGE, KEY, Buffer.from(JSON.stringify(payload)));

      console.log("Sent: " + JSON.stringify(payload));
    });
  });
}

function consumeMessage() {
  amqp.connect(`amqp://${RABBIT_HOST}`, (connectionError, connection) => {
    if (connectionError) throw connectionError;

    connection.createChannel((channelError, channel) => {
      if (channelError) throw channelError;

      channel.assertExchange(EXCHANGE, "direct", {
        durable: false,
      });

      channel.assertQueue(QUEUE, {
        exclusive: true,
      });

      channel.bindQueue(QUEUE, EXCHANGE, KEY);

      channel.consume(
        QUEUE,
        (payload) => {
          payload = JSON.parse(payload.content);
          console.log("Consumed: " + JSON.stringify(payload) + ". Key: " + KEY);

          if (payload.user != null) {
            io.emit("message", payload.user + ": " + payload.message);
          }
        },
        {
          noAck: true,
        }
      );
    });
  });
}

consumeMessage();

module.exports = {
  app,
};
