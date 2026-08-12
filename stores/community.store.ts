import { defineStore } from 'pinia'
import { StorageSerializers } from '@vueuse/core'
import type { Post, Comment } from '~/types/community.types'
import { mockPosts, commentsForPost, mockUsers, findUserById } from '~/services/mock/community.mock'

export const useCommunityStore = defineStore('community', {
  state: () => ({
    // useLocalStorage: لایک/کامنت/فالویی که کاربر اضافه می‌کنه باید بعد از رفرش بمونه.
    // posts هم با seed مقداردهی اولیه می‌شه (مثل postsهای مقاله‌ای که likesCount تغییر می‌کنه).
    posts: useLocalStorage<Post[]>('bargyar-community-posts', [...mockPosts]),
    comments: useLocalStorage<Record<string, Comment[]>>('bargyar-community-comments', {}),
    followingIds: useLocalStorage<Set<string>>('bargyar-community-following', new Set<string>(), {
      serializer: StorageSerializers.set,
    }),
  }),
  getters: {
    currentUser: () => mockUsers[0]!,
  },
  actions: {
    toggleLike(postId: string) {
      const post = this.posts.find(p => p.id === postId)
      if (!post) return
      post.likedByMe = !post.likedByMe
      post.likesCount += post.likedByMe ? 1 : -1
    },
    loadComments(postId: string) {
      if (!this.comments[postId]) {
        this.comments[postId] = commentsForPost(postId)
      }
      return this.comments[postId]
    },
    addComment(postId: string, content: string) {
      if (!content.trim()) return
      const comment: Comment = {
        id: `c${Date.now()}`,
        postId,
        author: this.currentUser,
        content,
        createdAt: new Date().toISOString(),
      }
      if (!this.comments[postId]) this.comments[postId] = []
      this.comments[postId]!.push(comment)
      const post = this.posts.find(p => p.id === postId)
      if (post) post.commentsCount += 1
    },
    isFollowing(userId: string) {
      return this.followingIds.has(userId)
    },
    toggleFollow(userId: string) {
      if (userId === this.currentUser.id) return
      if (this.followingIds.has(userId)) {
        this.followingIds.delete(userId)
      }
      else {
        this.followingIds.add(userId)
      }
    },
    postsByUser(userId: string) {
      return this.posts.filter(p => p.author.id === userId)
    },
    getUser(userId: string) {
      return findUserById(userId)
    },
  },
})
