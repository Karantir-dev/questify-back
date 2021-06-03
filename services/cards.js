const { CardsRepository } = require('../repositories')

class CardsService {
  constructor() {
    this.repositories = { cards: new CardsRepository() }
  }

  async getAll(userId, query) {
    const data = await this.repositories.cards.getAll(userId, query)
    return data
  }

  async getById(userId, id) {
    const data = await this.repositories.cards.getById(userId, id)
    return data
  }

  async remove(userId, id) {
    const data = await this.repositories.cards.remove(userId, id)
    return data
  }

  async create(userId, body) {
    const data = await this.repositories.cards.create(userId, body)
    return data
  }

  async update(userId, id, body) {
    const data = await this.repositories.cards.update(userId, id, body)
    return data
  }
}

module.exports = CardsService
