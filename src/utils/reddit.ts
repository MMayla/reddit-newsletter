import Reddit from 'snoowrap'

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

export const getTopPostsPastDay = async (subreddit: string, limit?: number) => {
  const client = getRedditClient()
  const topPosts = await client.getSubreddit(subreddit).getTop({ time: 'day', limit: limit })
  return topPosts.map((p) => ({
    title: p.title,
    media: p.preview.images[0].source,
    votes: p.ups,
  }))
}
