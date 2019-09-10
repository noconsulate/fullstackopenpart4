const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({}).populate('user', {username: 1, name: 1})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const likes = body.likes == null? 0 : body.likes

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.stats(404).json( { error: 'token missing or invalid'})
    }

    let user = await User.findById(decodedToken.id)
    const blog = new Blog({
      author: body.author,
      title: body.title,
      url: body.url,
      likes: likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  console.log('in delete route')
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken) {
      return response.status(404).json({ error: 'missing or invalid token'})
    }
    const blog = await Blog.findById(request.params.id)
    console.log(blog, request.params.id)
    if (blog.user.toString() === decodedToken.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      response.status(401).json( { error: 'can\'t delete another usesr\'s post' })
    }
  } catch (exception) {
    next(exception)
  }

  /*
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }*/
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  const updated = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes + 1,
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