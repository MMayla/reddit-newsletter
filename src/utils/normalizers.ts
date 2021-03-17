import { Post } from './reddit'

export const arrayToLowercase = (list: Array<string | number>): string[] =>
  list.map((item) => item.toString().toLowerCase())

export const normalizeNumberToK = (n: number): string =>
  n >= 1000 ? Math.floor(n / 1000).toString() + 'k' : n.toString()

export type NormalizedPost = Omit<Post, 'votes'> & { votes: string }

export const normalizePost = (post: Post): NormalizedPost => ({
  ...post,
  votes: normalizeNumberToK(post.votes),
})

export const normalizePosts = (posts: Post[]): NormalizedPost[] => posts.map((p) => normalizePost(p))
