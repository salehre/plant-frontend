export interface CommunityUser {
  id: string
  name: string
  avatar: string
  bio: string
  plantsCount: number
  followersCount: number
  followingCount: number
}

export interface Comment {
  id: string
  postId: string
  author: CommunityUser
  content: string
  createdAt: string
}

export interface Post {
  id: string
  author: CommunityUser
  image: string
  caption: string
  plantTag?: string
  createdAt: string
  likesCount: number
  likedByMe: boolean
  commentsCount: number
}
