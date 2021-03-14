import { Router } from 'express'
import { post } from './post'
import { get } from './get'
import { put } from './put'

export const UserController: Router = Router()

UserController.post('/', post)
UserController.get('/', get)
UserController.put('/', put)
