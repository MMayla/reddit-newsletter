import { NextFunction, Request, Response } from 'express'
import * as t from 'typed-validators'

import { getUser, updateUser } from '../../utils/db'

const PutUserRequestValidator = t.object({
  required: {
    user_id: t.string(),
  },
  optional: {
    first_name: t.string(),
    last_name: t.string(),
    email: t.string(),
    subreddits: t.array(t.string()),
    subscribed: t.boolean(),
  },
})
type PutUserRequest = t.ExtractType<typeof PutUserRequestValidator>

export const put = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = PutUserRequestValidator.validate(req.body)

    if (validation.hasErrors()) {
      return res.status(400).json({
        errorMessage: 'Validation Error',
        errors: validation.errors.map((e) => e.toString()),
      })
    }

    const reqBody: PutUserRequest = req.body

    const user = getUser(reqBody.user_id)

    if (!user) {
      res.status(404).json({
        errorMessage: 'User not found',
      })
    }

    const updatedUser = updateUser(reqBody.user_id, {
      firstName: reqBody.first_name,
      lastName: reqBody.last_name,
      email: reqBody.email,
      subreddits: reqBody.subreddits,
      subscribed: reqBody.subscribed,
    })

    res.status(200).json({ user: updatedUser })
  } catch (e) {
    next(e)
  }
}
