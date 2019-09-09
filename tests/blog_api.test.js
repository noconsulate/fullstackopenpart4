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

test('id key, not _id', async () => {
  const request = await api.get('/api/blogs')
  console.log(request.body);
  
  expect(request.body[0]).toHaveProperty('id')
})

test('new post results in correct number of posts', async () => {
  const newBlog = testData.newPost

  await api
  .post('/api/blogs')
  .send(newBlog).expect(201)
  .expect('Content-Type', /application\/json/)

  const request = await api.get('/api/blogs')
  expect(request.body.length).toBe(testData.blogs.length + 1)
})

test('a new note with empty likes value will be set to zero', async () => {
  const newBlog = helper.blogWithEmptyLikes
  const response = await api
  .post('/api/notes')
  .send(newBlog)
  
  console.log(response.body)
  expect(response.body.likes).toBe(0)
})

afterAll(() => {
  mongoose.connection.close()
})