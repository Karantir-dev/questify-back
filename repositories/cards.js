const Card = require('../schemas/card')

class CardsRepository {
  constructor() {
    this.model = Card
  }

  async getAll(userId, query) {
    const {
      sortBy,
      sortByDesc,
      filter,
      isChallenge = null,
      isCompleted = null,
      limit = Number.MAX_SAFE_INTEGER,
      offset = 0,
    } = query
    const optionsSearch = { owner: userId }
    if (isChallenge !== null) {
      optionsSearch.isChallenge = isChallenge
    }
    if (isCompleted !== null) {
      optionsSearch.isCompleted = isCompleted
    }
    const results = await this.model.paginate(optionsSearch, {
      limit,
      offset,
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
        ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
      },
      select: filter ? filter.split('|').join(' ') : '',
      populate: {
        path: 'owner',
        select: 'name email -_id',
      },
    })
    return results
  }

  async getById(userId, id) {
    const result = await this.model
      .findOne({ _id: id, owner: userId })
      .populate({
        path: 'owner',
        select: 'name email -_id',
      })
    return result
  }

  async create(userId, body) {
    let result = await this.model.create({ ...body, owner: userId })
    result = await result
      .populate({
        path: 'owner',
        select: 'name email -_id',
      })
      .execPopulate()
    return result
  }

  async remove(userId, id) {
    const result = await this.model
      .findByIdAndRemove({ _id: id, owner: userId })
      .populate({
        path: 'owner',
        select: 'name email -_id',
      })
    return result
  }

  async update(userId, id, body) {
    const result = await this.model
      .findByIdAndUpdate({ _id: id, owner: userId }, { ...body }, { new: true })
      .populate({
        path: 'owner',
        select: 'name email -_id',
      })
    return result
  }
}

module.exports = CardsRepository
