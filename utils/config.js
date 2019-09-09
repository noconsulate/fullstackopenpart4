require('dotenv').config()

let PORT = process.env.PORT
let MONGOODB_URI = process.env.MONGOODB_URI

if (process.env.NODE_ENV === 'test') {
  MONGOODB_URI = process.env.TEST_MONGODB_URL
}

module.exports = {
  MONGOODB_URI,
  PORT
}