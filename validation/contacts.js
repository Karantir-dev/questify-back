const Joi = require('joi')
const mongoose = require('mongoose')
const { httpStatusCodes } = require('../helpers/httpstatuscodes')

const schemaCreateContact = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required(),
  phone: Joi.string().min(3).max(15).required(),
  favorite: Joi.boolean().optional(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .optional(),
  phone: Joi.string().min(3).max(15).optional(),
  favorite: Joi.boolean().optional(),
}).min(1)

const schemaUpdateFavorite = Joi.object({
  favorite: Joi.boolean().required(),
})

const schemaQueryContact = Joi.object({
  sortBy: Joi.string().valid('name', 'email', 'id').optional(),
  sortByDesc: Joi.string().valid('name', 'email', 'id').optional(),
  filter: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(50).optional(),
  offset: Joi.number().integer().min(0).optional(),
  favorite: Joi.boolean().optional(),
}).without('sortBy', 'sortByDesc')

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

module.exports.validateCreateContact = (req, res, next) => {
  return validate(schemaCreateContact, req.body, next)
}

module.exports.validateUpdateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next)
}

module.exports.validateUpdateFavorite = (req, res, next) => {
  return validate(schemaUpdateFavorite, req.body, next)
}

module.exports.validateQueryContact = (req, res, next) => {
  return validate(schemaQueryContact, req.query, next)
}

module.exports.validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
    return next({
      status: 'error',
      code: httpStatusCodes.BAD_REQUEST,
      message: 'Invalid Object Id',
      data: 'Bad Request',
    })
  }
  return next()
}
