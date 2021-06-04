const express = require('express')
const router = express.Router()
const {
  listCards,
  getCardById,
  removeCard,
  addCard,
  updateCard,
  updateStatusCard,
} = require('../../controllers/cards')
const {
  validateCreateCard,
  validateUpdateCard,
  validateUpdateChallenge,
  validateUpdateComplete,
  validateQueryCard,
  validateObjectId,
} = require('../../validation/cards')
const guard = require('../../helpers/guard')

router.patch(
  '/:cardId/challenge',
  [guard, validateObjectId, validateUpdateChallenge],
  updateStatusCard,
)
router.patch(
  '/:cardId/complete',
  [guard, validateObjectId, validateUpdateComplete],
  updateStatusCard,
)

router.put(
  '/:cardId',
  [guard, validateObjectId, validateUpdateCard],
  updateCard,
)

router.post('/', guard, validateCreateCard, addCard)

router.get('/', guard, validateQueryCard, listCards)
router.get('/:cardId', guard, validateObjectId, getCardById)

router.delete('/:cardId', guard, validateObjectId, removeCard)

module.exports = router
