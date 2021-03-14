import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { nanoid } from 'nanoid'
import { User } from 'types'

export type DBType = lowdb.LowdbSync<{ users: Array<User> }>

export const getDB = (dbPath?: string) => {
  const adapter = new FileSync<{ users: Array<User> }>(dbPath || 'db.json')
  const db = lowdb(adapter)
  db.defaults({ users: [] }).write()
  return db
}

export const addUser = (user: Omit<User, 'id'>, db?: DBType): User => {
  const currentDB = db || getDB(process.env.DATABASE_PATH)
  const newUser: User = {
    id: nanoid(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    subreddits: user.subreddits,
    subscribed: user.subscribed,
  }
  currentDB.get('users').push(newUser).write()
  return newUser
}

export const getUser = (userId: string, db?: DBType): User => {
  const currentDB = db || getDB(process.env.DATABASE_PATH)

  const user = currentDB.get('users').find({ id: userId }).value()

  return user
}
