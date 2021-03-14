import { NextFunction, Request, Response } from 'express'
import * as t from 'typed-validators'

import { getUser } from '../../utils/db'

const GetUserRequestValidator = t.object({
  user_id: t.string(),
})
type GetUserRequest = t.ExtractType<typeof GetUserRequestValidator>

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = GetUserRequestValidator.validate(req.body)

    if (validation.hasErrors()) {
      return res.status(400).json({
        errorMessage: 'Validation Error',
        errors: validation.errors.map((e) => e.toString()),
      })
    }

    const reqBody: GetUserRequest = req.body

    const user = getUser(reqBody.user_id)

    if (!user) {
      res.status(404).json({
        errorMessage: 'User not found',
      })
    }

    res.status(200).json({ user: user })
  } catch (e) {
    next(e)
  }
}
