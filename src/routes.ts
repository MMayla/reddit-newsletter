import { Application, Router } from 'express'
import { IndexController } from './controllers/IndexController'
import { UserController } from './controllers/UserController'

const _routes: [string, Router][] = [
  ['/', IndexController],
  ['/user', UserController],
]

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, controller] = route
    app.use(url, controller)
  })
}
