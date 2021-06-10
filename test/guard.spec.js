const passport = require('passport')
const guard = require('../helpers/guard')
const { httpStatusCodes } = require('../helpers/httpstatuscodes')
const { User } = require('../repositories/__mocks__/data')

describe('Unit test: helper/guard', () => {
  const req = { get: jest.fn(header => `Bearer ${User.token}`), user: User }
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(response => response),
  }
  const next = jest.fn()

  test('run guard with user', () => {
    passport.authenticate = jest.fn(
      (authType, options, cb) => (req, res, next) => {
        cb(null, User)
      },
    )
    guard(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  test('run guard without user', () => {
    passport.authenticate = jest.fn(
      (authType, options, cb) => (req, res, next) => {
        cb(null, false)
      },
    )
    guard(req, res, next)
    expect(req.get).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: httpStatusCodes.FORBIDDEN,
      message: 'Access denied',
      data: 'Forbidden',
    })
  })

  test('run guard wrong user token', () => {
    passport.authenticate = jest.fn(
      (authType, options, cb) => (req, res, next) => {
        cb(null, (User.token = null))
      },
    )
    guard(req, res, next)
    expect(req.get).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: httpStatusCodes.FORBIDDEN,
      message: 'Access denied',
      data: 'Forbidden',
    })
    expect(next).toHaveBeenCalled()
  })

  test('run guard with error', () => {
    passport.authenticate = jest.fn(
      (authType, options, cb) => (req, res, next) => {
        cb(new Error(), false)
      },
    )
    guard(req, res, next)
    expect(req.get).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: httpStatusCodes.FORBIDDEN,
      message: 'Access denied',
      data: 'Forbidden',
    })
    expect(next).toHaveBeenCalled()
  })
})
