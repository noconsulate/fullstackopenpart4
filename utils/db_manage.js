const mongoose = require('mongoose')

const Blog = require('../models/blogs')
const User = require('../models/users')

const deleteBlogs = async () => {
  await Blog.deleteMany({})
}

const deleteUsers = async () => {
  await User.deleteMany({})
}