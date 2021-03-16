import request from 'supertest'
import { app } from '../../app'
import { TEST_DB_PATH } from './constants'

beforeAll(() => {
  process.env.DATABASE_PATH = TEST_DB_PATH
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

    console.log(`Checking if user ${validUserRequest.user_id} exist`)
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
