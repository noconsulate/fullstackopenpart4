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

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.post('/', async (request, response, next) => {
  console.log('in post')
  const body = request.body
  const likes = body.likes == null? 0 : body.likes
  const token = getTokenFrom(request)
  console.log(body)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log(decodedToken)
    if (!token || !decodedToken.id) {
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