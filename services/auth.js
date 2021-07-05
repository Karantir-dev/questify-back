const { UsersRepository } = require('../repositories')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET_KEY

class AuthService {
  constructor() {
    this.repositories = { users: new UsersRepository() }
  }

  async login({ email, password }) {
    const user = await this.repositories.users.findByEmail(email)
    if (!user) return null

    if (!user.verify) {
      const token = null
      return { token, user }
    }
    
    const id = user.id
    await this.logout(id)
    const isValidPassword = await user.validPassword(password)
    if (!isValidPassword) return null

    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '6h' })
    await this.repositories.users.updateToken(id, token)

    return { token, user }
  }

  async logout(id) {
    return await this.repositories.users.updateToken(id, null)
  }

  async verifyUser(token) {
    const user = await this.repositories.users.findByVerifyTokenEmail(token)
    if (user) {
      await this.repositories.users.updateVerifyToken(user.id, true, null)
      return user
    }
    return null
  }
}

module.exports = AuthService
