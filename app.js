const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const rateLimit = require('express-rate-limit')
const boolParser = require('express-query-boolean')
const helmet = require('helmet')

const { httpStatusCodes } = require('./helpers/httpstatuscodes.js')

const contactsRouter = require('./routes/contactsRoutes')
const usersRouter = require('./routes/usersRoutes')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(helmet())

app.use(logger(formatsLogger))
app.use(express.static('public'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    return res.status(httpStatusCodes.TOO_MANY_REQUESTS).json({
      status: 'error',
      code: httpStatusCodes.TOO_MANY_REQUESTS,
      message: 'Too Many Requests',
      data: 'HTTP_TOO_MANY_REQUESTS',
    })
  },
})
app.use(limiter)

app.use(
  cors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: httpStatusCodes.NO_CONTENT,
  }),
)
app.use(express.json({ limit: 100000 }))
app.use(boolParser())

app.use('/contacts', contactsRouter)
app.use('/users', usersRouter)

app.use((req, res) => {
  res.status(httpStatusCodes.NOT_FOUND).json({
    status: 'error',
    code: httpStatusCodes.NOT_FOUND,
    message: `Use api on routes ${req.baseUrl}/contacts or ${req.baseUrl}/users`,
    data: 'Not Found',
  })
})

app.use((err, req, res, next) => {
  err.code = err.code ? err.code : httpStatusCodes.INTERNAL_SERVER_ERROR
  res.status(err.code).json({
    status: err.code === 500 ? 'fail' : 'error',
    code: err.code,
    message: err.message,
    data: err.code === 500 ? 'Internal Server Error' : err.data,
  })
})

module.exports = app
