const User = require('../schemas/user')

class UsersRepository {
  constructor() {
    this.model = User
  }

  async findById(id) {
    return await this.model.findById(id)
  }

  async findByToken(token) {
    return await this.model.findOne({ token })
  }

  async findByVerifyTokenEmail(token) {
    return await this.model.findOne({ verifyTokenEmail: token })
  }

  async findByEmail(email) {
    return await this.model.findOne({ email })
  }

  async createContact(data) {
    // eslint-disable-next-line new-cap
    const user = new this.model(data)
    return await user.save()
  }

  async updateToken(id, token) {
    return await this.model.updateOne({ _id: id }, { token })
  }

  async updateVerifyToken(id, verify, verifyToken) {
    return await this.model.updateOne(
      { _id: id },
      { verify, verifyTokenEmail: verifyToken },
    )
  }

  async update(id, body) {
    return await this.model.findOneAndUpdate(
      { _id: id },
      { ...body },
      { new: true },
    )
  }

  async updateAvatar(id, avatarUrl, idCloudAvatar = null) {
    const data = await this.model.updateOne(
      { _id: id },
      { avatar: avatarUrl, idCloudAvatar },
    )
    return data
  }
}

module.exports = UsersRepository
