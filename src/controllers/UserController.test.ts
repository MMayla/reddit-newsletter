import request from 'supertest'
import { app } from '../app'
import { getDB } from '../utils/db'

const testDBPath = 'db-test.json'
const db = getDB(testDBPath)

beforeAll(() => {
  process.env.DATABASE_PATH = testDBPath
})

beforeEach(() => {
  db.setState({ users: [] }).write()
})

describe('Test UserController /user Post Requests', () => {
  it('Valid request should return a user', async () => {
    const validUserRequest = {
      first_name: 'Mohamed',
      last_name: 'Mayla',
      email: 'mohamedmayla@gmail.com',
      subreddits: ['worldnews'],
    }

    const result = await request(app).post('/user').send(validUserRequest)

    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      user: {
        id: expect.any(String),
        firstName: validUserRequest.first_name,
        lastName: validUserRequest.last_name,
        email: validUserRequest.email,
        subreddits: validUserRequest.subreddits,
        subscribed: true,
      },
    })
  })

  it('Invalid request should return validation errors', async () => {
    const validUserRequest = {
      last_name: 'Mayla',
      email: 'mohamedmayla@gmail.com',
      subreddits: ['worldnews'],
    }

    const result = await request(app).post('/user').send(validUserRequest)

    expect(result.status).toBe(400)
    expect(result.body).toEqual({
      errorMessage: 'Validation Error',
      errors: expect.arrayContaining(['input is missing required property first_name, which must be a string']),
    })
  })
})

describe('Test UserController /user Get Requests', () => {
  it('Valid request should return a user', async () => {
    const postUser = {
      first_name: 'Mohamed',
      last_name: 'Mayla',
      email: 'mohamedmayla@gmail.com',
      subreddits: ['worldnews'],
    }

    const postResult = await request(app).post('/user').send(postUser)

    const validUserRequest = {
      user_id: postResult.body.user.id,
    }

    const result = await request(app).get('/user').send(validUserRequest)

    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      user: {
        id: validUserRequest.user_id,
        firstName: postUser.first_name,
        lastName: postUser.last_name,
        email: postUser.email,
        subreddits: postUser.subreddits,
        subscribed: true,
      },
    })
  })

  it('Invalid request should return validation errors', async () => {
    const result = await request(app).get('/user').send({})

    expect(result.status).toBe(400)
    expect(result.body).toEqual({
      errorMessage: 'Validation Error',
      errors: expect.arrayContaining(['input is missing required property user_id, which must be a string']),
    })
  })

  it('Not existing user_id should return "User not found"', async () => {
    const result = await request(app).get('/user').send({
      user_id: 'NOT_A_USER_ID',
    })

    expect(result.status).toBe(404)
    expect(result.body).toEqual({
      errorMessage: 'User not found',
    })
  })
})

describe('Test UserController /user Put Requests', () => {
  it('Valid request should return a user', async () => {
    const postUser = {
      first_name: 'Mohamed',
      last_name: 'Mayla',
      email: 'mohamedmayla@gmail.com',
      subreddits: ['worldnews'],
    }

    const postResult = await request(app).post('/user').send(postUser)

    const validUserRequest = {
      user_id: postResult.body.user.id,
      email: 'updated.email@email.com',
      subreddits: ['worldnews', 'programmerhumor'],
      subscribed: false,
    }

    const result = await request(app).put('/user').send(validUserRequest)

    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      user: {
        id: validUserRequest.user_id,
        firstName: postUser.first_name,
        lastName: postUser.last_name,
        email: validUserRequest.email,
        subreddits: validUserRequest.subreddits,
        subscribed: validUserRequest.subscribed,
      },
    })
  })

  it('Invalid request should return validation errors', async () => {
    const result = await request(app)
      .put('/user')
      .send({
        subredditsss: ['worldnews', 'programmerhumor'],
      })

    expect(result.status).toBe(400)
    expect(result.body).toEqual({
      errorMessage: 'Validation Error',
      errors: expect.arrayContaining(['input has unknown property: subredditsss']),
    })
  })

  it('Not existing user_id should return "User not found"', async () => {
    const result = await request(app).put('/user').send({
      user_id: 'NOT_A_USER_ID',
    })

    expect(result.status).toBe(404)
    expect(result.body).toEqual({
      errorMessage: 'User not found',
    })
  })
})
