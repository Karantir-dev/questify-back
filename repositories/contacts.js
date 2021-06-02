const Contact = require('../schemas/contact')

class ContactsRepository {
  constructor() {
    this.model = Contact
  }

  async getAll(userId, query) {
    const {
      sortBy,
      sortByDesc,
      filter,
      favorite = null,
      limit = 5,
      offset = 0,
    } = query
    const optionsSearch = { owner: userId }
    if (favorite !== null) {
      optionsSearch.favorite = favorite
    }

    const results = await this.model
      .paginate(optionsSearch, {
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
      .then(({ docs }) => docs)
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
    const result = await this.model
      .create({ ...body, owner: userId })
      .populate({
        path: 'owner',
        select: 'name email -_id',
      })
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

module.exports = ContactsRepository
