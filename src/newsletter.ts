import schedule from 'node-schedule'
import pug from 'pug'
import path from 'path'
import { getAllUsers } from './utils/db'
import { getTopPostsPastDayForSubs } from './utils/reddit'
import { sendEmail } from './utils/email'
import { normalizePosts, NormalizedPost } from './utils/normalizers'

const NEWSLETTER_TEMPLATE_PATH = path.join(__dirname, 'templates', 'newsletter.pug')

export const job = schedule.scheduleJob('0 8 * * *', async () => {
  const subscribedUsers = getAllUsers().filter((u) => u.subscribed)
  const subreddits = subscribedUsers.reduce<string[]>((acc, user) => acc.concat(user.subreddits), [])
  const subsTopPosts = await getTopPostsPastDayForSubs(subreddits, 3)
  const compiledFunction = pug.compileFile(NEWSLETTER_TEMPLATE_PATH)

  for (const user of subscribedUsers) {
    console.log(`Generating email for ${user.firstName} with id ${user.id}`)
    const subs = user.subreddits.reduce<Record<string, NormalizedPost[]>>((acc, sub) => {
      const posts = subsTopPosts[sub]
      if (posts && posts.length > 0) {
        acc[sub] = normalizePosts(posts)
      }
      return acc
    }, {})

    const html = compiledFunction({
      subs,
      userFirstName: user.firstName,
    })

    try {
      await sendEmail(user.email, 'Your Daily Reddit Newsletter', "Check your today's reddit newsletter", html)
    } catch (error) {
      console.log(`Error sending email ${user.email}`)
      console.error(error.response?.body?.errors)
    }
  }
})
