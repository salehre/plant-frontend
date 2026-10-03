import { defineStore } from 'pinia'
import { StorageSerializers } from '@vueuse/core'
import type { Post, Comment } from '~/types/community.types'
import { getMockComments, getMockPosts, getMockUsers, commentsForPost, findUserById } from '~/services/mock/community.mock'
import type { MockLocale } from '~/services/mock/mock-locale'

export const useCommunityStore = defineStore('community', {
  state: () => ({
    // useLocalStorage: لایک/کامنت/فالویی که کاربر اضافه می‌کنه باید بعد از رفرش بمونه.
    // posts هم با seed مقداردهی اولیه می‌شه (مثل postsهای مقاله‌ای که likesCount تغییر می‌کنه).
    posts: useLocalStorage<Post[]>('bargyar-community-posts', getMockPosts()),
    comments: useLocalStorage<Record<string, Comment[]>>('bargyar-community-comments', {}),
    followingIds: useLocalStorage<Set<string>>('bargyar-community-following', new Set<string>(), {
      serializer: StorageSerializers.set,
    }),
  }),
  getters: {
    currentUser: () => getMockUsers()[0]!,
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
    localizedComments(postId: string, locale: MockLocale): Comment[] {
      const comments = this.loadComments(postId)
      const translatedComments = new Map(getMockComments(locale).map(comment => [comment.id, comment]))
      const translatedUsers = new Map(getMockUsers(locale).map(user => [user.id, user]))
      return comments.map((comment) => {
        const translated = translatedComments.get(comment.id)
        return {
          ...comment,
          content: translated?.content ?? comment.content,
          author: translatedUsers.get(comment.author.id) ?? translated?.author ?? comment.author,
        }
      })
    },
    addComment(postId: string, content: string, locale: MockLocale = 'fa') {
      if (!content.trim()) return
      const comment: Comment = {
        id: `c${Date.now()}`,
        postId,
        author: this.currentUserFor(locale),
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
    localizedPosts(locale: MockLocale): Post[] {
      const translatedPosts = new Map(getMockPosts(locale).map(post => [post.id, post]))
      const translatedUsers = new Map(getMockUsers(locale).map(user => [user.id, user]))
      return this.posts.map((post) => {
        const translated = translatedPosts.get(post.id)
        return {
          ...(translated ?? post),
          author: translatedUsers.get(post.author.id) ?? translated?.author ?? post.author,
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          likedByMe: post.likedByMe,
        }
      })
    },
    currentUserFor(locale: MockLocale) {
      return getMockUsers(locale).find(user => user.id === this.currentUser.id) ?? this.currentUser
    },
    postsByUser(userId: string, locale: MockLocale) {
      return this.localizedPosts(locale).filter(p => p.author.id === userId)
    },
    getUser(userId: string, locale: MockLocale) {
      return findUserById(userId, locale)
    },
  },
})
