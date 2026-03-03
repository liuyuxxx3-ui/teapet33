import { motion } from 'framer-motion';
import { 
  Settings, ChevronRight, ShoppingBag, Heart, 
  Trophy, Bookmark, HelpCircle, FileText, LogOut,
  Sprout
} from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAppStore } from '@/stores/appStore';
import { evolutionStages } from '@/data/user';

export function Profile() {
  const { user, teaPet, cart, setCurrentPage } = useAppStore();
  
  const currentStage = evolutionStages.find(s => 
    s.stage === (teaPet.stage === 'baby' ? 1 : teaPet.stage === 'juvenile' ? 2 : 3)
  );
  
  const menuItems = [
    { icon: Sprout, label: '我的茶宠', badge: null, onClick: () => setCurrentPage('myteapet') },
    { icon: ShoppingBag, label: '我的订单', badge: cart.length > 0 ? cart.length : null, onClick: () => {} },
    { icon: Heart, label: '我的收藏', badge: null, onClick: () => {} },
    { icon: Trophy, label: '我的成就', badge: null, onClick: () => {} },
    { icon: Bookmark, label: '浏览记录', badge: null, onClick: () => {} },
    { icon: FileText, label: '定制档案', badge: null, onClick: () => {} },
    { icon: HelpCircle, label: '帮助中心', badge: null, onClick: () => {} },
    { icon: Settings, label: '设置', badge: null, onClick: () => {} }
  ];
  
  return (
    <MobileLayout
      showNavBar={false}
      className="bg-[#F5F0E6]"
    >
      {/* 用户信息卡片 */}
      <div 
        className="rounded-b-3xl p-6 pt-12"
        style={{ background: 'linear-gradient(180deg, #8FBC6B 0%, #7A9E6E 100%)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xl font-bold text-[#8FBC6B]">
              {user.nickname.charAt(0)}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">{user.nickname}</h2>
            <p className="text-white/70 text-xs">Lv.{user.level} 茶道行者</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-center">
                <p className="text-white font-bold text-sm">{user.following}</p>
                <p className="text-white/60 text-[10px]">关注</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-sm">{user.followers}</p>
                <p className="text-white/60 text-[10px]">粉丝</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-sm">{user.points}</p>
                <p className="text-white/60 text-[10px]">积分</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 茶宠信息 */}
      <div className="px-4 -mt-3">
        <motion.div 
          className="cozy-card p-3"
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentPage('myteapet')}
        >
          <div className="flex items-center gap-3">
            <img 
              src={teaPet.image} 
              alt={teaPet.name}
              className="w-12 h-12 object-contain"
            />
            <div className="flex-1">
              <p className="font-semibold text-[#5C4A3A] text-sm">{teaPet.name}</p>
              <p className="text-xs text-[#9A8B7A]">{currentStage?.name}</p>
              <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                <span className="text-[#8FBC6B]">灵气: {teaPet.aura}</span>
                <span className="text-[#7AA857]">润泽: {teaPet.moisture}%</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#9A8B7A]" />
          </div>
        </motion.div>
      </div>
      
      {/* 连续打卡 */}
      <div className="px-4 mt-3">
        <div className="cozy-card p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#5C4A3A] text-sm">连续打卡</p>
              <p className="text-xl font-bold text-[#8FBC6B] mt-0.5">
                {user.checkInStreak} <span className="text-xs text-[#9A8B7A] font-normal">天</span>
              </p>
            </div>
            <div className="flex gap-1">
              {['一', '二', '三', '四', '五', '六', '日'].map((day, i) => (
                <div 
                  key={day}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                    i < 5 ? 'bg-[#8FBC6B] text-white' : 'bg-[#F5F0E6] text-[#9A8B7A]'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 菜单列表 */}
      <div className="px-4 mt-3">
        <div className="cozy-card overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                className={`w-full flex items-center gap-3 p-3 ${
                  index !== menuItems.length - 1 ? 'border-b border-[#F5F0E6]' : ''
                }`}
                whileTap={{ scale: 0.98 }}
                onClick={item.onClick}
              >
                <div className="w-8 h-8 bg-[#8FBC6B]/10 rounded-lg flex items-center justify-center">
                  <Icon size={16} className="text-[#8FBC6B]" />
                </div>
                <span className="flex-1 text-left text-[#5C4A3A] text-sm">{item.label}</span>
                {item.badge && (
                  <span className="w-4 h-4 bg-[#E8A87C] text-white text-[10px] rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={16} className="text-[#9A8B7A]" />
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* 退出登录 */}
      <div className="px-4 mt-3 mb-6">
        <motion.button
          className="w-full flex items-center justify-center gap-2 p-3 cozy-card text-[#E8A87C]"
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={18} />
          <span className="text-sm">退出登录</span>
        </motion.button>
      </div>
    </MobileLayout>
  );
}
