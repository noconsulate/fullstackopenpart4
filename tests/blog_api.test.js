const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const testData = require('./test_data')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of testData.blogs) {
    let noteObject = new Blog(blog)
    await noteObject.save()
  }
})

test('proper number of notes is returned', async () => {
  const request = await api.get('/api/blogs')
  console.log(request.toJSON())

  expect(request.length).toBe(testData.blogs.length)
})

test('testing', () => {
  const poop = 'pee'
  expect(poop).toBe('pee')
}

)