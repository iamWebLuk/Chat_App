const RABBIT_HOST = process.env.RABBIT_HOST || 'localhost'
const QUEUE = process.env.QUEUE || 'chatQueue'
const EXCHANGE = process.env.EXCHANGE || 'chatExchange'
const SERVER_PORT = +process.env.HTTP_PORT || 3000

module.exports = {
  RABBIT_HOST,
  QUEUE,
  EXCHANGE,
  SERVER_PORT,
};
