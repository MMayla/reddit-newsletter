import { NextFunction, Request, Response, Router } from 'express'
import * as t from 'typed-validators'

import { addUser } from '../utils/db'

export const UserController: Router = Router()

const PostUserRequestValidator = t.object({
  required: {
    first_name: t.string(),
    email: t.string(),
    subreddits: t.array(t.string()),
  },
  optional: {
    last_name: t.string(),
    subscribed: t.boolean(),
  },
})
type PostUserRequest = t.ExtractType<typeof PostUserRequestValidator>

UserController.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = PostUserRequestValidator.validate(req.body)

    if (validation.hasErrors()) {
      return res.status(400).json({
        errorMessage: 'Validation Error',
        errors: validation.errors.map((e) => e.toString()),
      })
    }

    const reqBody: PostUserRequest = req.body

    const createdUser = addUser({
      firstName: reqBody.first_name,
      lastName: reqBody.last_name,
      email: reqBody.email,
      subreddits: reqBody.subreddits,
      subscribed: reqBody.subscribed || true,
    })

    res.status(200).json({ user: createdUser })
  } catch (e) {
    next(e)
  }
})

const GetUserRequestValidator = t.object({
  userId: t.string(),
})
type GetUserRequest = t.ExtractType<typeof GetUserRequestValidator>

UserController.get('/', async (req: Request<GetUserRequest>, res: Response, next: NextFunction) => {
  try {
    console.log(req)
    res.status(200).send({ data: 'GET USER' })
  } catch (e) {
    next(e)
  }
})
