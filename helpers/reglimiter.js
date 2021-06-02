const rateLimit = require('express-rate-limit')
const { httpStatusCodes } = require('../helpers/httpstatuscodes')

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes (first param)
  max: 2, // limit each IP to 2 requests per windowMs
  handler: (req, res, next) => {
    return res.status(httpStatusCodes.TOO_MANY_REQUESTS).json({
      status: 'error',
      code: httpStatusCodes.TOO_MANY_REQUESTS,
      message: 'Too Many Requests',
      data: 'HTTP_TOO_MANY_REQUESTS',
    })
  },
})

module.exports = limiter
