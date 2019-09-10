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

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  const updated = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes + 1
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updated, 
      {new: true})
    response.json(updatedBlog.toJSON())
  } catch {
    next(exception)
  }
})

module.exports = blogsRouter