const RABBIT_HOST = process.env.RABBIT_HOST || 'localhost'
const QUEUE = process.env.QUEUE || 'chatQueue1'
const EXCHANGE = process.env.EXCHANGE || 'chatExchange1'
const KEY = process.env.KEY || 'chatMessage'
const SERVER_PORT = process.env.HTTP_PORT || 3000
const ISSUER_BASE_URL = process.env.ISSUER_BASE_URL || 'https://dev-nmyjvgsl.eu.auth0.com'
const CLIENT_ID = process.env.CLIENT_ID || '4dprU14dWnzyZI22eKksUU0J2ev6yin9'
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const SECRET = process.env.SECRET || '4b40855ddfa32711cf56cf26e7a87816aecc40639f061a30ced47f78692f2b28f0f7ca43b5a0a9d0a15b650e24578b4a6bb8a82a092e658ec0501dc0add2b908'


module.exports = {
  RABBIT_HOST,
  QUEUE,
  EXCHANGE,
  KEY,
  SERVER_PORT,
  ISSUER_BASE_URL,
  CLIENT_ID,
  BASE_URL,
  SECRET
}
