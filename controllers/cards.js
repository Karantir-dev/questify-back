const { httpStatusCodes } = require('../helpers/httpstatuscodes')
const { CardsService } = require('../services')
const cardsService = new CardsService()

const listCards = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const query = req.query
    const data = await cardsService.getAll(userId, query)
    const cards = data.map(
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
      data: {
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
        data: {
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
        data: 'Not Found',
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
      data: {
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
        data: {
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
        data: 'Not Found',
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
        data: {
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
        data: 'Not Found',
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
        data: {
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
        data: 'Not Found',
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
