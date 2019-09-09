const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')


blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const likes = body.likes == null? 0 : body.likes
  
  const blog = new Blog({
      authoer: body.author,
      title: body.title,
      url: body.url,
      likes: likes
    })


  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter