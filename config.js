const RABBIT_HOST = process.env.RABBIT_HOST || 'localhost'
const EXCHANGE = process.env.EXCHANGE || 'chatExchange'
const SERVER_PORT = +process.env.HTTP_PORT || 3000

module.exports = {
  RABBIT_HOST,
  EXCHANGE,
  SERVER_PORT,
};
