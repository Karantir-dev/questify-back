const Joi = require('joi');

const schemaPostPut = Joi.object({
  name: Joi.string().min(2).max(40).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  favourite: Joi.boolean().optional(),
});

const schemaPatch = Joi.object({
  name: Joi.string().min(2).max(40).optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().optional(),
  favourite: Joi.boolean().optional(),
}).or('name', 'email', 'phoneNumber', 'favourite');

module.exports = {
  validatePatch: async (req, res, next) => {
    try {
      await schemaPatch.validateAsync(req.body);
      return next();
    } catch (err) {
      next({ status: 'error', code: 400, message: err.message });
    }
  },
  validatePostPut: async (req, res, next) => {
    try {
      await schemaPostPut.validateAsync(req.body);
      return next();
    } catch (err) {
      next({
        status: 'error',
        code: 400,
        message: err.message.replace(/"/g, "'"),
      });
    }
  },
};
