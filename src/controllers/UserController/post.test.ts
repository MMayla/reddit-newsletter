import request from 'supertest'
import { app } from '../../app'
import { getDB } from '../../utils/db'

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
