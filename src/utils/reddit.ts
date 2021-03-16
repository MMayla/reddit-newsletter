import Reddit from 'snoowrap'
import { ImagePreviewSource } from 'snoowrap/dist/objects/Submission'

interface Post {
  title: string
  image?: ImagePreviewSource
  votes: number
  url: string
}

let _client: Reddit

const getRedditEnvVars = (): string[] => {
  const requiredEnvVars = ['REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET', 'REDDIT_USERNAME', 'REDDIT_PASSWORD']
  const redditVars: string[] = []
  requiredEnvVars.forEach((v) => {
    if (!process.env[v]) {
      throw new Error(`${v} not defined`)
    }
    redditVars.push(process.env[v] as string)
  })

  return redditVars
}

const getRedditClient = () => {
  const [clientId, clientSecret, username, password] = getRedditEnvVars()

  if (!_client) {
    _client = new Reddit({
      clientId,
      clientSecret,
      username,
      password,
      userAgent: 'Newsletter/1.0.0',
    })
  }

  return _client
}

export const getTopPostsPastDay = async (subreddit: string, limit?: number): Promise<Post[]> => {
  const client = getRedditClient()
  const topPosts = await client.getSubreddit(subreddit).getTop({ time: 'day', limit: limit })
  return topPosts.map((p) => ({
    title: p.title,
    image: p.preview ? p.preview.images[0].source : undefined,
    votes: p.ups,
    url: p.url,
  }))
}

export const getTopPostsPastDayForSubs = async (subreddits: string[], limit?: number) => {
  const topPostsBySubs: Record<string, Post[]> = {}
  for (const sub of subreddits) {
    const subLowerCase = sub.toLowerCase()
    const posts = await getTopPostsPastDay(subLowerCase, limit)
    if (!topPostsBySubs[subLowerCase]) {
      topPostsBySubs[subLowerCase] = posts
    }
  }

  return topPostsBySubs
}
