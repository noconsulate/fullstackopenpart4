const listHelper = require('../utils/list_helper')  
const testData = require('./test_data')


test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = testData.listWithOneBlog

  test('when the list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  const blogs = testData.blogs

  test('when there are five blogs with differing likes', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  const blog = testData.blogs

  test('when there are five blogs with different likes', () => {
    const expected = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }
    const result = listHelper.favoriteBlog(blog)
    expect(result).toEqual(expected)
  })
})