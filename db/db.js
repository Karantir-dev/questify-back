const mongoose = require('mongoose')

require('dotenv').config()
const uriDataBase = process.env.URI_DB

const db = mongoose.connect(uriDataBase, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
})

mongoose.connection.on('connected', () => {
  console.log('Database connection successful')
})

mongoose.connection.on('error', error => {
  console.log(`Mongoose connection error: ${error.message}`)
  process.exit(1)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected')
})

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Connection for DB disconnected and app terminated')
    process.exit(1)
  })
})

module.exports = db
