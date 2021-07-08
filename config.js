const RABBIT_HOST = process.env.RABBIT_HOST || 'localhost'
const QUEUE = process.env.QUEUE || 'chatQueue1'
const EXCHANGE = process.env.EXCHANGE || 'chatExchange1'
const KEY = process.env.KEY || 'chatMessage'
const SERVER_PORT = process.env.HTTP_PORT || 3000
const SECRET = process.env.SECRET || '4b40855ddfa32711cf56cf26e7a87816aecc40639f061a30ced47f78692f2b28f0f7ca43b5a0a9d0a15b650e24578b4a6bb8a82a092e658ec0501dc0add2b908'
const MONGODBCONNECTION = process.env.MONGODBCONNECTION|| 'mongodb+srv://admin:mPqXCToj8bKuRlBy@cluster0.zichr.mongodb.net/cluster0?retryWrites=true&w=majority'



module.exports = {
  RABBIT_HOST,
  QUEUE,
  EXCHANGE,
  KEY,
  SERVER_PORT,
  SECRET,
  MONGODBCONNECTION
}
