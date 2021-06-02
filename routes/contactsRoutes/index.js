const express = require('express')
const router = express.Router()
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require('../../controllers/contacts.js')
const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateFavorite,
  validateObjectId,
  validateQueryContact,
} = require('../../validation/contacts.js')
const guard = require('../../helpers/guard.js')

router
  .get('/', guard, validateQueryContact, listContacts)
  .post('/', guard, validateCreateContact, addContact)

router
  .get('/:contactId', guard, validateObjectId, getContactById)
  .put(
    '/:contactId',
    [guard, validateObjectId, validateUpdateContact],
    updateContact,
  )
  .delete('/:contactId', guard, validateObjectId, removeContact)

router.patch(
  '/:contactId/favorite',
  [guard, validateObjectId, validateUpdateFavorite],
  updateStatusContact,
)

module.exports = router
