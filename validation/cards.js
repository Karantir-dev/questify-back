const Joi = require('joi')
const mongoose = require('mongoose')
const { httpStatusCodes } = require('../helpers/httpstatuscodes')
const { Difficulty, Category } = require('../helpers/constants')

const schemaCreateCard = Joi.object({
  isChallenge: Joi.boolean().optional(),
  isCompleted: Joi.boolean().optional(),
  text: Joi.string().min(1).max(128).required(),
  difficulty: Joi.string()
    .valid(Difficulty.EASY, Difficulty.NORMAL, Difficulty.HARD)
    .optional(),
  category: Joi.string()
    .valid(
      Category.STUFF,
      Category.FAMILY,
      Category.HEALTH,
      Category.LEARNING,
      Category.LEISURE,
      Category.WORK,
    )
    .required(),
  deadline: Joi.date()
    .min('now')
    .message('"date" cannot be earlier than now')
    .required(),
})

const schemaUpdateCard = Joi.object({
  isChallenge: Joi.boolean().optional(),
  isCompleted: Joi.boolean().optional(),
  text: Joi.string().min(1).max(128).optional(),
  difficulty: Joi.string()
    .valid(Difficulty.EASY, Difficulty.NORMAL, Difficulty.HARD)
    .optional(),
  category: Joi.string()
    .valid(
      Category.STUFF,
      Category.FAMILY,
      Category.HEALTH,
      Category.LEARNING,
      Category.LEISURE,
      Category.WORK,
    )
    .optional(),
  deadline: Joi.date()
    .min('now')
    .message('"date" cannot be earlier than now')
    .optional(),
}).min(1)

const schemaUpdateChallenge = Joi.object({
  isChallenge: Joi.boolean().required(),
})

const schemaUpdateComplete = Joi.object({
  isCompleted: Joi.boolean().required(),
})

const schemaQueryCard = Joi.object({
  sortBy: Joi.string()
    .valid('category', 'deadline', 'isChallenge', 'isCompleted', 'difficulty')
    .optional(),
  sortByDesc: Joi.string()
    .valid('category', 'deadline', 'isChallenge', 'isCompleted', 'difficulty')
    .optional(),
  filter: Joi.string().optional(),
  limit: Joi.number().integer().min(1).optional(),
  offset: Joi.number().integer().min(0).optional(),
  isChallenge: Joi.boolean().optional(),
  isCompleted: Joi.boolean().optional(),
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

module.exports.validateCreateCard = (req, res, next) => {
  return validate(schemaCreateCard, req.body, next)
}

module.exports.validateUpdateCard = (req, res, next) => {
  return validate(schemaUpdateCard, req.body, next)
}

module.exports.validateUpdateChallenge = (req, res, next) => {
  return validate(schemaUpdateChallenge, req.body, next)
}

module.exports.validateUpdateComplete = (req, res, next) => {
  return validate(schemaUpdateComplete, req.body, next)
}

module.exports.validateQueryCard = (req, res, next) => {
  return validate(schemaQueryCard, req.query, next)
}

module.exports.validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return next({
      status: 'error',
      code: httpStatusCodes.BAD_REQUEST,
      message: 'Invalid Object Id',
      data: 'Bad Request',
    })
  }
  return next()
}
