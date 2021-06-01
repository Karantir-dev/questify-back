const Joi = require('joi');
const HttpCode = require('../../helpers/constants.js');

const schemaRegistrationCredentials = Joi.object({
  name: Joi.string().min(2).max(35).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
});
const schemaLoginCredentials = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
});

const schemaSubscription = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').optional(),
});

module.exports = {
  validateLoginCredentials: async (req, res, next) => {
    try {
      await schemaLoginCredentials.validateAsync(req.body);
      return next();
    } catch (err) {
      next({
        status: 'Bad Request',
        code: HttpCode.BAD_REQUEST,
        message: err.message.replace(/"/g, "'"),
      });
    }
  },
  validateRegistrationCredentials: async (req, res, next) => {
    try {
      await schemaRegistrationCredentials.validateAsync(req.body);
      return next();
    } catch (err) {
      next({
        status: 'Bad Request',
        code: HttpCode.BAD_REQUEST,
        message: err.message.replace(/"/g, "'"),
      });
    }
  },
  validateSubscription: async (req, res, next) => {
    try {
      await schemaSubscription.validateAsync(req.body);
      return next();
    } catch (err) {
      next({
        status: 'Bad Request',
        code: HttpCode.BAD_REQUEST,
        message: err.message.replace(/"/g, "'"),
      });
    }
  },
};
