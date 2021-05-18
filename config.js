const RABBIT_HOST = process.env.RABBIT_HOST || 'localhost'
const QUEUE = process.env.QUEUE || 'chatQueue1'
const EXCHANGE = process.env.EXCHANGE || 'chatExchange1'
const KEY = process.env.KEY || 'chatMessage'
const SERVER_PORT = +process.env.HTTP_PORT || 3000


module.exports = {
  RABBIT_HOST,
  QUEUE,
  EXCHANGE,
  KEY,
  SERVER_PORT
};
