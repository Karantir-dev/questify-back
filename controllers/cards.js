const { httpStatusCodes } = require('../helpers/httpstatuscodes')
const { CardsService } = require('../services')
const cardsService = new CardsService()

const listCards = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const query = req.query
    const { docs } = await cardsService.getAll(userId, query)
    const cards = docs.map(
      ({
        id,
        text,
        isChallenge,
        isCompleted,
        difficulty,
        category,
        deadline,
      }) => {
        return {
          id,
          difficulty,
          isChallenge,
          text,
          category,
          isCompleted,
          deadline,
        }
      },
    )
    res.status(httpStatusCodes.OK).json({
      status: 'success',
      code: httpStatusCodes.OK,
      message: 'OK',
      result: {
        cards,
      },
    })
  } catch (error) {
    next(error)
  }
}

const getCardById = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { cardId: id } = req.params
    const card = await cardsService.getById(userId, id)
    if (card) {
      const {
        id,
        text,
        isChallenge,
        isCompleted,
        difficulty,
        category,
        deadline,
      } = card
      return res.status(httpStatusCodes.OK).json({
        status: 'success',
        code: httpStatusCodes.OK,
        message: 'OK',
        result: {
          id,
          difficulty,
          isChallenge,
          text,
          category,
          isCompleted,
          deadline,
        },
      })
    } else {
      return next({
        status: 'error',
        code: httpStatusCodes.NOT_FOUND,
        message: 'Not found card',
        result: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

const addCard = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const {
      id,
      text,
      isChallenge,
      isCompleted,
      difficulty,
      category,
      deadline,
    } = await cardsService.create(userId, req.body)
    res.status(httpStatusCodes.CREATED).json({
      status: 'success',
      code: httpStatusCodes.CREATED,
      message: 'card success created',
      result: {
        id,
        difficulty,
        isChallenge,
        text,
        category,
        isCompleted,
        deadline,
      },
    })
  } catch (error) {
    next(error)
  }
}

const removeCard = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { cardId: id } = req.params
    const card = await cardsService.remove(userId, id)
    if (card) {
      const {
        id,
        text,
        isChallenge,
        isCompleted,
        difficulty,
        category,
        deadline,
      } = card
      return res.status(httpStatusCodes.OK).json({
        status: 'DELETE',
        code: httpStatusCodes.OK,
        message: 'card success deleted',
        result: {
          id,
          difficulty,
          isChallenge,
          text,
          category,
          isCompleted,
          deadline,
        },
      })
    } else {
      return next({
        status: 'error',
        code: httpStatusCodes.NOT_FOUND,
        message: 'Not found card',
        result: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

const updateCard = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { cardId: id } = req.params
    const card = await cardsService.update(userId, id, req.body)
    if (card) {
      const {
        id,
        text,
        isChallenge,
        isCompleted,
        difficulty,
        category,
        deadline,
      } = card
      return res.status(httpStatusCodes.OK).json({
        status: 'success',
        code: httpStatusCodes.OK,
        message: 'card success updated',
        result: {
          id,
          difficulty,
          isChallenge,
          text,
          category,
          isCompleted,
          deadline,
        },
      })
    } else {
      return next({
        status: 'error',
        code: httpStatusCodes.NOT_FOUND,
        message: 'Not found card',
        result: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

const updateStatusCard = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { cardId: id } = req.params
    const card = await cardsService.update(userId, id, req.body)
    if (card) {
      const {
        id,
        text,
        isChallenge,
        isCompleted,
        difficulty,
        category,
        deadline,
      } = card
      return res.status(httpStatusCodes.OK).json({
        status: 'success',
        code: httpStatusCodes.OK,
        message: 'card status is update',
        result: {
          id,
          difficulty,
          isChallenge,
          text,
          category,
          isCompleted,
          deadline,
        },
      })
    } else {
      return next({
        status: 'error',
        code: httpStatusCodes.NOT_FOUND,
        message: 'Not found card',
        result: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listCards,
  getCardById,
  removeCard,
  addCard,
  updateCard,
  updateStatusCard,
}
