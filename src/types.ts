export interface User {
  id: string
  firstName: string
  lastName?: string
  email: string
  subreddits: string[]
  subscribed: boolean
}
