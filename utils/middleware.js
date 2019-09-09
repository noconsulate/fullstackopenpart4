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
 
  console.log(error.name, error.message, request.body)

  if (error.message === 'Blog validation failed: likes: Path `likes` is required.') {
    const fixedBlog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: 0
    })
    console.log(fixedBlog);
  }
}

module.exports = {
  errorHandler
}