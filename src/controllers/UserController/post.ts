import { NextFunction, Request, Response } from 'express'
import * as t from 'typed-validators'

import { EmailType, NameType } from './validators'
import { addUser } from '../../utils/db'

const PostUserRequestValidator = t.object({
  required: {
    first_name: NameType,
    email: EmailType,
    subreddits: t.array(t.string()),
  },
  optional: {
    last_name: NameType,
    subscribed: t.boolean(),
  },
})
type PostUserRequest = t.ExtractType<typeof PostUserRequestValidator>

export const post = async (req: Request, res: Response, next: NextFunction) => {
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
}
