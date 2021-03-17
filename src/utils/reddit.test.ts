import dotenv from 'dotenv'
import { getTopPostsPastDay, getTopPostsPastDayForSubs } from './reddit'

beforeAll(() => {
  dotenv.config()
})

describe('Reddit Utils', () => {
  it('Get top 3 posts for existing subreddit', async () => {
    const posts = await getTopPostsPastDay('askreddit', 3)
    expect(posts.length).toBe(3)
  })

  it('Try to get posts for non-existing subreddit', async () => {
    const posts = await getTopPostsPastDay('THIS-SUBREDDIT-NOT-EXISTING-EDDJHC@', 3)
    expect(posts.length).toBe(0)
  })

  it('Get top 3 post for list of subreddits', async () => {
    const subsPosts = await getTopPostsPastDayForSubs(['funny', 'this-subreddit-not-existing-eddjhc@', 'funny'], 3)

    expect(Object.keys(subsPosts)).toStrictEqual(['funny', 'this-subreddit-not-existing-eddjhc@'])
    expect(subsPosts['funny'].length).toBe(3)
    expect(subsPosts['this-subreddit-not-existing-eddjhc@'].length).toBe(0)
  })
})
