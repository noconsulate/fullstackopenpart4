//for workshopping the functions
const data = require('../tests/test_data')
const _ = require('lodash')

const blogs = data.blogs

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce( (a, b) => {
    return a + b.likes
  }, 0)
}

const favoriteBlog = blogs => {
  const favorite = blogs.reduce( (prev, current) => {
    return prev.likes > current.likes ? prev : current
  })
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = blogs => {
  //use lodash zip? or countBy? groupby?
  //gave up for now, remember to return after part 4
  let authors = [];
  let combinedBlogs = [];

  blogs.forEach(author => {

  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}