const { User, users } = require('./data')

class UsersRepository {
  findById = jest.fn(id => {
    const [user] = users.filter(item => String(item._id) === String(id))
    return user
  })

  findByToken = jest.fn(token => {
    return {}
  })

  findByVerifyTokenEmail = jest.fn(token => {
    return {}
  })

  findByEmail = jest.fn(email => {
    return {}
  })

  createUser = jest.fn(data => {
    return {}
  })

  updateToken = jest.fn((id, token) => {
    return {}
  })

  updateVerifyToken = jest.fn((id, verify, verifyToken) => {
    return {}
  })

  update = jest.fn((id, body) => {
    return {}
  })
}

module.exports = UsersRepository
