import type { User, TeaPet, EvolutionStage, Skin, Post, BattleRecord } from '@/types';

// 当前用户数据
export const currentUser: User = {
  id: '1',
  nickname: '茶道行者',
  avatar: '/images/avatars/user-1.jpg',
  points: 2580,
  level: 12,
  following: 128,
  followers: 256,
  checkInStreak: 15
};

// 当前茶宠数据
export const currentTeaPet: TeaPet = {
  id: '1',
  name: '小青',
  stage: 'juvenile',
  level: 12,
  aura: 888,
  moisture: 92,
  intimacy: 85,
  skin: 'default',
  createdAt: new Date('2024-01-15'),
  image: '/images/tea-pet-stage-2.png'
};

// 进化阶段数据
export const evolutionStages: EvolutionStage[] = [
  {
    stage: 1,
    name: '灵芽期',
    description: '茶宠初生灵智，需要细心呵护',
    requiredAura: 0,
    requiredMoisture: 0,
    image: '/images/tea-pet-stage-1.png',
    unlocked: true
  },
  {
    stage: 2,
    name: '碧玉期',
    description: '茶宠开始成长，外观更加莹润',
    requiredAura: 500,
    requiredMoisture: 60,
    image: '/images/tea-pet-stage-2.png',
    unlocked: true
  },
  {
    stage: 3,
    name: '祥瑞期',
    description: '茶宠进化完全，环绕祥云锦鲤',
    requiredAura: 1500,
    requiredMoisture: 85,
    image: '/images/tea-pet-stage-3.png',
    unlocked: false
  }
];

// 皮肤数据
export const skins: Skin[] = [
  {
    id: 'default',
    name: '原初形态',
    description: '茶宠的原始形态，清新自然',
    image: '/images/tea-pet-stage-1.png',
    rarity: 'common',
    unlockType: 'level',
    unlockValue: 1,
    unlocked: true
  },
  {
    id: 'jade',
    name: '碧玉流光',
    description: '翠绿色光芒环绕，晶莹剔透',
    image: '/images/tea-pet-stage-2.png',
    rarity: 'rare',
    unlockType: 'level',
    unlockValue: 10,
    unlocked: true
  },
  {
    id: 'golden',
    name: '金鳞祥瑞',
    description: '金色鳞片覆盖，祥瑞之气弥漫',
    image: '/images/tea-pet-stage-3.png',
    rarity: 'epic',
    unlockType: 'level',
    unlockValue: 20,
    unlocked: false
  },
  {
    id: 'ink',
    name: '水墨丹青',
    description: '水墨风格，国风韵味十足',
    image: '/images/tea-pet-hero.png',
    rarity: 'legendary',
    unlockType: 'points',
    unlockValue: 5000,
    unlocked: false
  }
];

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: '2',
    nickname: '茶香四溢',
    avatar: '/images/avatars/user-2.jpg',
    points: 3200,
    level: 15,
    following: 89,
    followers: 342,
    checkInStreak: 23
  },
  {
    id: '3',
    nickname: '禅茶一味',
    avatar: '/images/avatars/user-3.jpg',
    points: 1890,
    level: 8,
    following: 156,
    followers: 89,
    checkInStreak: 7
  },
  {
    id: '4',
    nickname: '品茗雅士',
    avatar: '/images/avatars/user-4.jpg',
    points: 4560,
    level: 22,
    following: 234,
    followers: 567,
    checkInStreak: 45
  },
  {
    id: '5',
    nickname: '茶道初心',
    avatar: '/images/avatars/user-5.jpg',
    points: 980,
    level: 5,
    following: 45,
    followers: 23,
    checkInStreak: 3
  }
];

// 模拟帖子数据
export const mockPosts: Post[] = [
  {
    id: '1',
    author: mockUsers[0],
    content: '今天给我的茶宠"小青"做了养护，润泽度又提升了一点！看着它一天天成长，真的很有成就感。',
    images: ['/images/tea-pet-stage-2.png'],
    likes: 128,
    comments: 23,
    createdAt: new Date('2024-03-01'),
    tags: ['茶宠养成', '养护心得'],
    isLiked: false
  },
  {
    id: '2',
    author: mockUsers[1],
    content: '分享一下我的茶宠定制经验，选择紫砂材质的茶宠，养护起来更有质感，包浆效果也更好。',
    images: ['/images/products/product-1.jpg', '/images/products/product-7.jpg'],
    likes: 256,
    comments: 45,
    createdAt: new Date('2024-02-28'),
    tags: ['定制经验', '紫砂茶宠'],
    isLiked: true
  },
  {
    id: '3',
    author: mockUsers[2],
    content: '斗茶竞技终于赢了！我的茶宠灵气值突破1000，战力大幅提升，大家一起来切磋吧！',
    images: ['/images/tea-pet-stage-3.png'],
    likes: 512,
    comments: 89,
    createdAt: new Date('2024-02-27'),
    tags: ['斗茶竞技', '战力提升'],
    isLiked: false
  },
  {
    id: '4',
    author: mockUsers[3],
    content: '刚入手了一个金蟾茶宠，造型非常精致，放在茶盘上很有格调，推荐给大家！',
    images: ['/images/products/product-8.jpg'],
    likes: 89,
    comments: 12,
    createdAt: new Date('2024-02-26'),
    tags: ['新品入手', '金蟾茶宠'],
    isLiked: false
  }
];

// 模拟对战记录
export const mockBattles: BattleRecord[] = [
  {
    id: '1',
    opponent: mockUsers[0],
    result: 'win',
    myScore: 1250,
    opponentScore: 980,
    date: new Date('2024-03-01')
  },
  {
    id: '2',
    opponent: mockUsers[1],
    result: 'lose',
    myScore: 1100,
    opponentScore: 1350,
    date: new Date('2024-02-28')
  },
  {
    id: '3',
    opponent: mockUsers[2],
    result: 'win',
    myScore: 1450,
    opponentScore: 1200,
    date: new Date('2024-02-25')
  }
];

// 获取排行榜数据
export const getLeaderboard = () => {
  return [
    { rank: 1, user: mockUsers[2], score: 4560 },
    { rank: 2, user: mockUsers[0], score: 3200 },
    { rank: 3, user: currentUser, score: 2580 },
    { rank: 4, user: mockUsers[1], score: 1890 },
    { rank: 5, user: mockUsers[3], score: 980 }
  ];
};
