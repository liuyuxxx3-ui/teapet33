// 茶宠数据类型
export interface TeaPet {
  id: string;
  name: string;
  stage: 'baby' | 'juvenile' | 'adult' | 'legendary';
  level: number;
  aura: number;        // 灵气值
  moisture: number;    // 润泽度
  intimacy: number;    // 亲密度
  skin: string;        // 当前皮肤
  createdAt: Date;
  image: string;
}

// 商品数据类型
export interface Product {
  id: string;
  name: string;
  category: 'teapet' | 'tool' | 'tea' | 'accessory';
  price: number;
  points?: number;     // 积分兑换
  image: string;
  description: string;
  stock: number;
  rating: number;
  sales: number;
}

// 用户数据类型
export interface User {
  id: string;
  nickname: string;
  avatar: string;
  points: number;      // 积分
  level: number;
  following: number;
  followers: number;
  checkInStreak: number;  // 连续打卡天数
}

// 帖子数据类型
export interface Post {
  id: string;
  author: User;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  tags: string[];
  isLiked?: boolean;
}

// 对战记录类型
export interface BattleRecord {
  id: string;
  opponent: User;
  result: 'win' | 'lose' | 'draw';
  myScore: number;
  opponentScore: number;
  date: Date;
}

// 进化阶段类型
export interface EvolutionStage {
  stage: number;
  name: string;
  description: string;
  requiredAura: number;
  requiredMoisture: number;
  image: string;
  unlocked: boolean;
}

// 皮肤类型
export interface Skin {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockType: 'level' | 'points' | 'purchase';
  unlockValue: number;
  unlocked: boolean;
  rewardClaimed?: boolean;
}

// 导航项类型
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

// 打卡记录类型
export interface CheckInRecord {
  date: Date;
  type: 'sensor' | 'photo' | 'daily';
  points: number;
}

// 设计图类型
export interface Design {
  id: string;
  name: string;
  type: 'custom' | 'skin' | 'ai';
  material: string;
  accessory: string;
  customText: string;
  image: string;
  createdAt: Date;
  teaPetId: string;
}
