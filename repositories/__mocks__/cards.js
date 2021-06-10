const { cards } = require('./data')

class CardsRepository {
  getAll = jest.fn((userId, query) => {
    const {
      limit = Number.MAX_SAFE_INTEGER,
      offset = 0,
      isChallenge = null,
      isCompleted = null,
    } = query
    const docs = cards
    return {
      docs,
      totalDocs: docs.length,
      offset,
      limit,
      isChallenge,
      isCompleted,
    }
  })

  getById = jest.fn((userId, idCard) => {
    const [card] = cards.filter(item => String(item.id) === String(idCard))
    return card
  })

  create = jest.fn((userId, body) => {
    cards.push({ ...body, id: '777000000000044444444666' })
    return { ...body, id: '777000000000044444444666' }
  })

  remove = jest.fn((userId, idCard) => {
    const index = cards.findIndex(item => String(item.id) === String(idCard))
    if (index === -1) return null
    const [card] = cards.splice(index, 1)
    return card
  })

  update = jest.fn((userId, idCard, body) => {
    let [card] = cards.filter(item => String(item.id) === String(idCard))
    if (card) card = { ...card, ...body }
    return card
  })
}

module.exports = CardsRepository
