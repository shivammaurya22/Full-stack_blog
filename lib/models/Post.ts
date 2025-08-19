export interface Post {
  _id?: string
  title: string
  content: string
  tags: string[]
  authorId: string
  authorName: string
  authorUsername: string
  authorImage?: string
  likes: string[] // Array of user IDs who liked the post
  createdAt: Date
  updatedAt: Date
}

export interface CreatePostData {
  title: string
  content: string
  tags: string[]
  authorId: string
  authorName: string
  authorUsername: string
  authorImage?: string
  likes?: string[] // Optional for new posts
}
