const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const rateLimit = require('express-rate-limit')
const boolParser = require('express-query-boolean')
const helmet = require('helmet')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger/swagger.json')

const { httpStatusCodes } = require('./helpers/httpstatuscodes.js')

const usersRouter = require('./routes/usersRoutes')
const cardsRouter = require('./routes/cardsRoutes')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(helmet())

app.get('env') !== 'test' && app.use(logger(formatsLogger))

app.use(express.static('public'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    return res.status(httpStatusCodes.TOO_MANY_REQUESTS).json({
      status: 'error',
      code: httpStatusCodes.TOO_MANY_REQUESTS,
      message: 'Too Many Requests',
      result: 'HTTP_TOO_MANY_REQUESTS',
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

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/users', usersRouter)
app.use('/cards', cardsRouter)

app.use((req, res) => {
  res.status(httpStatusCodes.NOT_FOUND).json({
    status: 'error',
    code: httpStatusCodes.NOT_FOUND,
    message: `Use api on routes ${req.baseUrl}/cards or ${req.baseUrl}/users.`,
    result: 'Not Found',
  })
})

app.use((err, req, res, next) => {
  err.code = err.code ? err.code : httpStatusCodes.INTERNAL_SERVER_ERROR
  res.status(err.code).json({
    status: err.code === 500 ? 'fail' : 'error',
    code: err.code,
    message: err.message,
    result: err.code === 500 ? 'Internal Server Error' : err.result,
  })
})

module.exports = app
