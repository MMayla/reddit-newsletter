import request from 'supertest'
import { app } from '../app'

describe('Test UserController', () => {
  it('Request /user should return GET USER', async () => {
    const result = await request(app).get('/user').send()

    expect(result.status).toBe(200)
    expect(result.body.data).toBe('GET USER')
  })
})
