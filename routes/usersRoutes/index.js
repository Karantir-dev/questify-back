const express = require('express');
const router = express.Router();
const {
  registration,
  login,
  logout,
  getCurrentUser,
  updateSubscr,
  updateAvatar,
  verifyEmail,
} = require('../../controller/users.js');
const {
  validateRegistrationCredentials,
  validateLoginCredentials,
  validateSubscription,
} = require('./credentialsValidation.js');
const guard = require('../../helpers/guard');
const uploadAvatar = require('../../helpers/upload-avatar');

router.post('/signUp', validateRegistrationCredentials, registration);
router.post('/login', validateLoginCredentials, login);
router.post('/logout', guard, logout);
router.get('/current', guard, getCurrentUser);
router.patch('/', guard, validateSubscription, updateSubscr);
router.patch('/avatars', guard, uploadAvatar.single('avatar'), updateAvatar);

router.get('/verify/:verificationToken', verifyEmail);
router.post('/verify');

module.exports = router;
