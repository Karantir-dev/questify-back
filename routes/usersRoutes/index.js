const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/users')
const {
  validateRegistrationUser,
  validateLoginUser,
  validatesUpdateSubscription,
} = require('../../validation/users')
const guard = require('../../helpers/guard')
const limiter = require('../../helpers/reglimiter')

router.patch('/', guard, validatesUpdateSubscription, ctrl.updateSubscription)

router.get('/current', guard, ctrl.getCurrent)
router.get('/verify/:token', ctrl.verifyUser)

router.post('/signup', limiter, validateRegistrationUser, ctrl.registration)
router.post('/login', validateLoginUser, ctrl.login)
router.post('/logout', guard, ctrl.logout)
router.post('/verify', ctrl.repeatEmailVerify)

module.exports = router
