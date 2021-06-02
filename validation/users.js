const Joi = require('joi')
const { httpStatusCodes } = require('../helpers/httpstatuscodes')

const schemaRegistrationUser = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required(),
  password: Joi.string().alphanum().min(3).max(30).required(),
})

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required(),
  password: Joi.string().alphanum().min(3).max(30).required(),
})

const validate = (schema, body, next) => {
  const { error } = schema.validate(body)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: 'error',
      code: httpStatusCodes.BAD_REQUEST,
      message: `Field: ${message.replace(/"/g, '')}`,
      data: 'Bad Request',
    })
  }
  return next()
}

module.exports.validateRegistrationUser = (req, res, next) => {
  return validate(schemaRegistrationUser, req.body, next)
}

module.exports.validateLoginUser = (req, res, next) => {
  return validate(schemaLoginUser, req.body, next)
}
