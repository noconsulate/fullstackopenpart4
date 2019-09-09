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
  const blog = new Blog({
    authoer: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes
  })
  console.log('in post router');
  
  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }

  /*
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    */
})

module.exports = blogsRouter