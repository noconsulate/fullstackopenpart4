const Blog = require('../models/blogs')
const app = require('../app')
require('dotenv').config()
const request = require('request')

if (process.env.NODE_ENV === 'test') {
  const supertest = require('supertest')
  const api = supertest(app)
  console.log('middleware test mode')
} else {
  const api = app
}

const errorHandler = (error, request, response, next) => {
  console.log(error.name)
  console.log(typeof error.message, error.message)

  if (error.message.includes('Blog validation failed:')) {
    return response.status(400).send({error: 'missing properites'})
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
    console.log(request.token)
  }
  next()
}

module.exports = {
  errorHandler, tokenExtractor
}