import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, TeaPet, Product, Post, CheckInRecord, EvolutionStage, BattleRecord, Design } from '@/types';
import { currentUser, currentTeaPet, mockPosts, evolutionStages } from '@/data/user';

interface AppState {
  // 用户数据
  user: User;
  setUser: (user: User) => void;
  
  // 茶宠数据
  teaPets: TeaPet[];
  currentTeaPetId: string | null;
  setTeaPet: (teaPet: TeaPet) => void;
  addTeaPet: (teaPet: TeaPet) => void;
  selectTeaPet: (teaPetId: string) => void;
  
  // 更新茶宠属性
  updateTeaPetStats: (stats: Partial<TeaPet>) => void;
  
  // 帖子数据
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  likePost: (postId: string) => void;
  addPost: (post: { id: string; content: string; tags: string[]; images: string[] }) => void;
  
  // 购物车
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // 打卡记录
  checkInRecords: CheckInRecord[];
  addCheckIn: (record: CheckInRecord) => void;
  
  // 对战记录
  battleRecords: BattleRecord[];
  saveBattleRecord: (record: BattleRecord) => void;
  
  // 设计图
  designs: Design[];
  currentDesignId: string | null;
  saveDesign: (design: Design) => void;
  selectDesign: (designId: string) => void;
  updateDesign: (design: Design) => void;
  deleteDesign: (designId: string) => void;
  
  // 进化阶段
  evolutionStages: EvolutionStage[];
  
  // 当前页面
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // 加载状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // 积分操作
  addPoints: (points: number) => void;
  deductPoints: (points: number) => boolean;
  
  // 茶宠进化
  evolveTeaPet: () => void;
  updateEvolutionStages: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始数据
      user: currentUser,
      teaPets: [currentTeaPet],
      currentTeaPetId: currentTeaPet.id,
      posts: mockPosts,
      cart: [],
      checkInRecords: [],
      battleRecords: [],
      designs: [],
      currentDesignId: null,
      evolutionStages: evolutionStages,
      currentPage: 'home',
      isLoading: false,
      
      // 用户操作
      setUser: (user) => set({ user }),
      
      // 茶宠操作
      setTeaPet: (teaPet) => set((state) => {
        const updatedTeaPets = state.teaPets.map(tp => 
          tp.id === state.currentTeaPetId ? teaPet : tp
        );
        return { teaPets: updatedTeaPets };
      }),
      addTeaPet: (teaPet) => set((state) => ({
        teaPets: [...state.teaPets, teaPet],
        currentTeaPetId: teaPet.id
      })),
      selectTeaPet: (teaPetId) => set({ currentTeaPetId: teaPetId }),
      updateTeaPetStats: (stats) => set((state) => {
        const updatedTeaPets = state.teaPets.map(tp => 
          tp.id === state.currentTeaPetId ? { ...tp, ...stats } : tp
        );
        return { teaPets: updatedTeaPets };
      }),
      
      // 帖子操作
      setPosts: (posts) => set({ posts }),
      likePost: (postId) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
            : post
        )
      })),
      addPost: (postData) => set((state) => {
        const newPost: Post = {
          id: postData.id,
          author: state.user,
          content: postData.content,
          images: postData.images,
          likes: 0,
          comments: 0,
          createdAt: new Date(),
          tags: postData.tags,
          isLiked: false
        };
        return { posts: [newPost, ...state.posts] };
      }),
      
      // 购物车操作
      addToCart: (product) => set((state) => ({
        cart: [...state.cart, product]
      })),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(p => p.id !== productId)
      })),
      clearCart: () => set({ cart: [] }),
      
      // 打卡操作
      addCheckIn: (record) => set((state) => ({
        checkInRecords: [...state.checkInRecords, record],
        user: {
          ...state.user,
          points: state.user.points + record.points,
          checkInStreak: state.user.checkInStreak + 1
        }
      })),
      
      // 对战记录操作
      saveBattleRecord: (record) => set((state) => ({
        battleRecords: [record, ...state.battleRecords].slice(0, 10) // 只保留最近10条记录
      })),
      
      // 设计图操作
      saveDesign: (design) => set((state) => ({
        designs: [design, ...state.designs],
        currentDesignId: design.id
      })),
      selectDesign: (designId) => set({ currentDesignId: designId }),
      updateDesign: (design) => set((state) => ({
        designs: state.designs.map(d => d.id === design.id ? design : d)
      })),
      deleteDesign: (designId) => set((state) => ({
        designs: state.designs.filter(d => d.id !== designId),
        currentDesignId: state.currentDesignId === designId ? null : state.currentDesignId
      })),
      
      // 页面操作
      setCurrentPage: (page) => set({ currentPage: page }),
      
      // 加载状态
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      // 积分操作
      addPoints: (points) => set((state) => ({
        user: { ...state.user, points: state.user.points + points }
      })),
      deductPoints: (points) => {
        const currentPoints = get().user.points;
        if (currentPoints >= points) {
          set((state) => ({
            user: { ...state.user, points: state.user.points - points }
          }));
          return true;
        }
        return false;
      },
      
      // 茶宠进化
      evolveTeaPet: () => set((state) => {
        const updatedTeaPets = state.teaPets.map(tp => {
          if (tp.id === state.currentTeaPetId) {
            let newLevel = tp.level;
            let newImage = tp.image;
            
            // 根据灵气值判断进化等级
            if (tp.aura >= 500 && tp.level < 2) {
              newLevel = 2;
              newImage = '/images/tea-pet-stage-2.png';
            } else if (tp.aura >= 1500 && tp.level < 3) {
              newLevel = 3;
              newImage = '/images/tea-pet-stage-3.png';
            }
            
            return {
              ...tp,
              level: newLevel,
              image: newImage
            };
          }
          return tp;
        });
        
        return {
          teaPets: updatedTeaPets
        };
      }),
      
      // 更新进化阶段
      updateEvolutionStages: () => set((state) => {
        const currentTeaPet = state.teaPets.find(tp => tp.id === state.currentTeaPetId) || state.teaPets[0];
        const updatedStages = evolutionStages.map(stage => ({
          ...stage,
          unlocked: stage.requiredAura <= currentTeaPet.aura && stage.requiredMoisture <= currentTeaPet.moisture
        }));
        
        return {
          evolutionStages: updatedStages
        };
      })
    }),
    {
      name: 'mingchachongshe-storage',
      partialize: (state) => ({
        user: state.user,
        teaPets: state.teaPets,
        currentTeaPetId: state.currentTeaPetId,
        checkInRecords: state.checkInRecords,
        posts: state.posts,
        cart: state.cart,
        designs: state.designs,
        currentDesignId: state.currentDesignId
      })
    }
  )
);
