import type { CommunityUser, Post, Comment } from '~/types/community.types'

export const mockUsers: CommunityUser[] = [
  {
    id: 'u1',
    name: 'سارا احمدی',
    avatar: '/images/plants/botanical-2.webp',
    bio: 'عاشق گیاهان آپارتمانی، صاحب ۲۰ گلدون در ۳۰ متر 🌿',
    plantsCount: 20,
    followersCount: 340,
    followingCount: 120,
  },
  {
    id: 'u2',
    name: 'رضا کریمی',
    avatar: '/images/plants/botanical-3.webp',
    bio: 'باغبان آماتور، یادگیری گیاهان دارویی',
    plantsCount: 12,
    followersCount: 98,
    followingCount: 210,
  },
  {
    id: 'u3',
    name: 'نیلوفر رستمی',
    avatar: '/images/plants/botanical-4.webp',
    bio: 'دیزاینر داخلی، متخصص چیدمان گیاه در خانه',
    plantsCount: 35,
    followersCount: 890,
    followingCount: 156,
  },
]

export const mockPosts: Post[] = [
  {
    id: 'post1',
    author: mockUsers[0]!,
    image: '/images/plants/botanical-3.webp',
    caption: 'مونسترای من بالاخره بعد از ۶ ماه اولین شکاف برگش رو زد! خیلی خوشحالم 🥹',
    plantTag: 'monstera-deliciosa',
    createdAt: '2026-07-27T10:00:00',
    likesCount: 42,
    likedByMe: false,
    commentsCount: 2,
  },
  {
    id: 'post2',
    author: mockUsers[1]!,
    image: '/images/plants/botanical-4.webp',
    caption: 'گوشه‌ی جدید گیاهان دارویی خونه. صبر زرد و نعناع کنار هم عالی شدن.',
    plantTag: 'aloe-vera',
    createdAt: '2026-07-26T18:30:00',
    likesCount: 27,
    likedByMe: true,
    commentsCount: 1,
  },
  {
    id: 'post3',
    author: mockUsers[2]!,
    image: '/images/plants/botanical-5.webp',
    caption: 'چیدمان گیاهان آویز توی پذیرایی. پوتوس‌ها هر هفته یه برگ جدید میدن 🌱',
    createdAt: '2026-07-25T09:15:00',
    likesCount: 76,
    likedByMe: false,
    commentsCount: 3,
  },
  {
    id: 'post4',
    author: mockUsers[0]!,
    image: '/images/plants/botanical-5.webp',
    caption: 'کسی تجربه‌ی مبارزه با کنه تارتن روی فیکوس داره؟ کمک می‌خوام 😩',
    plantTag: 'ficus-lyrata',
    createdAt: '2026-07-24T14:00:00',
    likesCount: 15,
    likedByMe: false,
    commentsCount: 4,
  },
]

export const mockComments: Comment[] = [
  {
    id: 'c1',
    postId: 'post1',
    author: mockUsers[2]!,
    content: 'وای چقدر خوشگل شده! تبریک میگم 👏',
    createdAt: '2026-07-27T11:00:00',
  },
  {
    id: 'c2',
    postId: 'post1',
    author: mockUsers[1]!,
    content: 'نور محیطش چقدره؟ مال من هنوز شکاف نزده',
    createdAt: '2026-07-27T12:30:00',
  },
  {
    id: 'c3',
    postId: 'post2',
    author: mockUsers[2]!,
    content: 'ترکیب رنگ گلدون‌ها عالیه',
    createdAt: '2026-07-26T19:00:00',
  },
  {
    id: 'c4',
    postId: 'post4',
    author: mockUsers[0]!,
    content: 'روغن نیم امتحان کن، برای من جواب داد',
    createdAt: '2026-07-24T15:00:00',
  },
]

export function commentsForPost(postId: string): Comment[] {
  return mockComments.filter(c => c.postId === postId)
}

export function findUserById(id: string): CommunityUser | undefined {
  return mockUsers.find(u => u.id === id)
}