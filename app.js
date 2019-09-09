const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const middleware = require('./utils/middleware')

console.log('connecting to mongoose')

const mongoUrl = 'mongodb+srv://user1:dixie636@cluster0-w6v1g.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(mongoUrl, { useNewUrlParser: true })

app.use(bodyParser())
app.use(cors())
app.use('/api/blogs', blogsRouter)
app.use(middleware.errorHandler)

module.exports = app

