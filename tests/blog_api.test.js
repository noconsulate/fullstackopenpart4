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
describe('blog api tests', () => {
  test('proper number of notes is returned', async () => {
    const request = await api.get('/api/blogs')
    expect(request.body.length).toBe(testData.blogs.length)
  })
  
  test('id key, not _id', async () => {
    const request = await api.get('/api/blogs')
    
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
    const newBlog = testData.blogWithEmptyLikes
    const response = await api
    .post('/api/blogs')
    .send(newBlog)
    expect(response.body.likes).toBe(0)
  })
  
  test('url and title properties required, gives 400 bad request', async () => {
    const badBlog = {
      title: null,
      url: null,
      author: "pissy pants phd",
      likes: 6000,
    }
  
    await api.post('/api/blogs').send(badBlog).expect(400)
  })
})

describe('users api tests requiring db reset', () => {

})

test('short usernames and passwords not excepted', async () => {
  const badUser = {
    name: 'bill bo',
    username: 'to',
    password: 'xx'
  }

   const result = await api
    .post('/api/users')
    .send(badUser)
    .expect(400)
    
  expect(result.body.error).toContain('too short')
})



afterAll(() => {
  mongoose.connection.close()
})