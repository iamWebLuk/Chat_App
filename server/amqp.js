const amqp = require("amqplib/callback_api");
const { RABBIT_HOST, QUEUE, EXCHANGE, KEY } = require("../config");

function consumeMessage(emit) {
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
            emit(payload);
          }
        },
        {
          noAck: true,
        }
      );
    });
  });
}

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

module.exports = {
  consumeMessage,
  publishMessage,
};
