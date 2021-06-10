const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const { User, cards, newCard } = require('../repositories/__mocks__/data')
require('dotenv').config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const issueToken = (payload, secret) => jwt.sign(payload, secret)
const token = issueToken({ id: User._id }, JWT_SECRET_KEY)
User.token = token

jest.mock('../repositories/cards.js')
jest.mock('../repositories/users.js')

describe('Testing route /cards', () => {
  let idNewCard = null

  describe('Testing GET requests', () => {
    test('await return status 200 for GET: /cards', async () => {
      const res = await request(app)
        .get('/cards')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.result.cards).toBeInstanceOf(Array)
    })

    test('await return status 200 for GET: /cards/:id', async () => {
      const card = cards[0]
      const res = await request(app)
        .get(`/cards/${card.id}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.result.id).toBe(card.id)
    })

    test('await return status 404 for GET: /cards/:id', async () => {
      const res = await request(app)
        .get(`/cards/60b8ccb1aa37e91d78b92666`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(404)
      expect(res.body).toBeDefined()
    })

    test('await return status 400 for GET: /cards/:id', async () => {
      const res = await request(app)
        .get(`/cards/666`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
    })
  })

  describe('Testing POST requests', () => {
    test('await return status 201 for POST: /cards', async () => {
      const res = await request(app)
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(newCard)
      expect(res.status).toEqual(201)
      expect(res.body).toBeDefined()
      idNewCard = res.body.result.id
    })

    test('await return status 400 for POST: /cards (with wrong field)', async () => {
      const res = await request(app)
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ ...newCard, test: 'wrongField' })
      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
    })

    test('await return status 400 for POST: /cards (without field)', async () => {
      const res = await request(app)
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ category: 'family' })
      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
    })
  })

  describe('Testing PUT requests', () => {
    test('await return status 200 for PUT: /cards/:id', async () => {
      const res = await request(app)
        .put(`/cards/${idNewCard}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ text: 'Test PUT for new card' })
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.result.text).toBe('Test PUT for new card')
    })

    test('await return status 400 for PUT: /cards/:id (update wrong field)', async () => {
      const res = await request(app)
        .put(`/cards/${idNewCard}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ test: 'wrongField' })
      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
    })

    test('await return status 404 for PUT: /cards/:id', async () => {
      const res = await request(app)
        .put(`/cards/60b8ccb1aa37e91d78b92666`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ category: 'family' })
      expect(res.status).toEqual(404)
      expect(res.body).toBeDefined()
    })
  })

  describe('Testing PATCH requests', () => {
    test('await return status 200 for PATCH: /cards/:cardId/challenge', async () => {
      const res = await request(app)
        .patch(`/cards/${idNewCard}/challenge`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ isChallenge: true })
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.result.isChallenge).toBe(true)
    })

    test('await return status 400 for PATCH: /cards/:id (patch wrong field)', async () => {
      const res = await request(app)
        .patch(`/cards/${idNewCard}/challenge`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ test: 'wrongField' })
      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
    })

    test('await return status 404 for PATCH: /cards/:id', async () => {
      const res = await request(app)
        .patch(`/cards/60b8ccb1aa37e91d78b92666/challenge`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ isChallenge: true })
      expect(res.status).toEqual(404)
      expect(res.body).toBeDefined()
    })

    test('await return status 200 for PATCH: /cards/:cardId/complete', async () => {
      const res = await request(app)
        .patch(`/cards/${idNewCard}/complete`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ isCompleted: true })
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.result.isCompleted).toBe(true)
    })

    test('await return status 400 for PATCH: /cards/:id/complete (patch wrong field)', async () => {
      const res = await request(app)
        .patch(`/cards/${idNewCard}/complete`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ test: 'wrongField' })
      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
    })

    test('await return status 404 for PATCH: /cards/:id/complete', async () => {
      const res = await request(app)
        .patch(`/cards/60b8ccb1aa37e91d78b92666/complete`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ isCompleted: true })
      expect(res.status).toEqual(404)
      expect(res.body).toBeDefined()
    })
  })

  describe('Testing DELETE requests', () => {
    const card = cards[1]
    test('await return status 200 for DELETE: /cards/:id', async () => {
      const res = await request(app)
        .delete(`/cards/${card.id}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.result).toStrictEqual(card)
    })

    test('await return status 404 for DELETE: /cards/:id ', async () => {
      const res = await request(app)
        .delete('/cards/60b8ccb1aa37e91d78b92666')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(404)
      expect(res.body).toBeDefined()
    })
  })
})
