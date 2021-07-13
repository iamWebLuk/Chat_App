const amqp = require("amqplib/callback_api");
const {
  RABBIT_HOST,
  QUEUE,
  EXCHANGE,
  UNFILTEREDKEY,
  UNFILTEREDQUEUE,
  FILTEREDQUEUE,
  FILTEREDKEY,
} = require("../config/config");
const { filterMessage } = require("../database/db-controller");

function publishUnfilteredMessage(payload) {
  amqp.connect(`amqp://${RABBIT_HOST}`, (connectionError, connection) => {
    if (connectionError) throw connectionError;

    connection.createChannel((channelError, channel) => {
      if (channelError) throw channelError;

      channel.assertExchange(EXCHANGE, "direct", {
        durable: false,
      });

      channel.publish(
        EXCHANGE,
        UNFILTEREDKEY,
        Buffer.from(JSON.stringify(payload))
      );

      console.log("Sent: " + JSON.stringify(payload));
    });
  });
}

function publishFilteredMessage(payload) {
  amqp.connect(`amqp://${RABBIT_HOST}`, (connectionError, connection) => {
    if (connectionError) throw connectionError;

    connection.createChannel((channelError, channel) => {
      if (channelError) throw channelError;

      channel.assertExchange(EXCHANGE, "direct", {
        durable: false,
      });

      channel.publish(
        EXCHANGE,
        FILTEREDKEY,
        Buffer.from(JSON.stringify(payload))
      );

      console.log("Sent: " + JSON.stringify(payload));
    });
  });
}

function consumeUnfilteredMessage() {
  amqp.connect(`amqp://${RABBIT_HOST}`, (connectionError, connection) => {
    if (connectionError) throw connectionError;

    connection.createChannel((channelError, channel) => {
      if (channelError) throw channelError;

      channel.assertExchange(EXCHANGE, "direct", {
        durable: false,
      });

      channel.assertQueue(UNFILTEREDQUEUE, {
        exclusive: true,
      });

      channel.bindQueue(UNFILTEREDQUEUE, EXCHANGE, UNFILTEREDKEY);

      channel.consume(
        QUEUE,
        (payload) => {
          payload = JSON.parse(payload.content);
          console.log(
            "Consumed unfiltered message: " +
              JSON.stringify(payload) +
              ". Key: " +
              UNFILTEREDKEY
          );
          if (payload.user != null) {
            filterMessage(payload.message).then((filteredMessage) => {
              payload.message = filteredMessage;
              publishFilteredMessage(payload);
            });
          }
        },
        {
          noAck: true,
        }
      );
    });
  });
}

function consumeFilteredMessage(emit) {
  amqp.connect(`amqp://${RABBIT_HOST}`, (connectionError, connection) => {
    if (connectionError) throw connectionError;

    connection.createChannel((channelError, channel) => {
      if (channelError) throw channelError;

      channel.assertExchange(EXCHANGE, "direct", {
        durable: false,
      });

      channel.assertQueue(FILTEREDQUEUE, {
        exclusive: true,
      });

      channel.bindQueue(FILTEREDQUEUE, EXCHANGE, FILTEREDKEY);

      channel.consume(
        QUEUE,
        (payload) => {
          payload = JSON.parse(payload.content);
          console.log(
            "Consumed filtered message: " +
              JSON.stringify(payload) +
              ". Key: " +
              FILTEREDKEY
          );

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

module.exports = {
  consumeFilteredMessage,
  consumeUnfilteredMessage,
  publishFilteredMessage,
  publishUnfilteredMessage,
};
