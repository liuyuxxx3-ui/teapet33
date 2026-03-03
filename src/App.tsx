import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import { Home } from '@/pages/Home';
import { Workshop } from '@/pages/Workshop';
import { Nurture } from '@/pages/Nurture';
import { Social } from '@/pages/Social';
import { Battle } from '@/pages/Battle';
import { Shop } from '@/pages/Shop';
import { Profile } from '@/pages/Profile';
import { MyTeaPet } from '@/pages/MyTeaPet';
import { TeaPetSelector } from '@/pages/TeaPetSelector';
import { Account } from '@/pages/Account';
import { InkLoading } from '@/components/common/InkLoading';
import { useEffect, useState } from 'react';

// 页面切换动画配置
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.3
};

function App() {
  const { currentPage, setCurrentPage } = useAppStore();
  const [showLoading, setShowLoading] = useState(true);
  
  // 初始加载动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
      // 加载后显示首页
      setCurrentPage('home');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [setCurrentPage]);
  
  // 渲染当前页面
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'nurture':
        return <Nurture />;
      case 'workshop':
        return <Workshop />;
      case 'social':
        return <Social />;
      case 'battle':
        return <Battle />;
      case 'shop':
        return <Shop />;
      case 'profile':
        return <Profile />;
      case 'myteapet':
        return <MyTeaPet />;
      case 'teaPetSelector':
        return <TeaPetSelector />;
      case 'account':
        return <Account />;
      default:
        return <Home />;
    }
  };
  
  // 判断是否显示底部导航栏（首页、茶宠选择页面和账号管理页面不显示）
  const showTabBar = currentPage !== 'home' && currentPage !== 'teaPetSelector' && currentPage !== 'account';
  
  if (showLoading) {
    return (
      <div className="mobile-container">
        <InkLoading />
      </div>
    );
  }
  
  return (
    <div className="mobile-container h-screen flex flex-col overflow-hidden">
      {/* 页面内容 */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className="h-full w-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* 底部导航栏 */}
      {showTabBar && (
        <div className="flex-shrink-0">
          <TabBar />
        </div>
      )}
    </div>
  );
}

// 底部导航栏组件
import { Sprout, Palette, Users, Swords, ShoppingBag, UserCircle } from 'lucide-react';

const tabs = [
  { id: 'nurture', label: '养成', icon: Sprout },
  { id: 'workshop', label: '工坊', icon: Palette },
  { id: 'social', label: '社区', icon: Users },
  { id: 'battle', label: '斗茶', icon: Swords },
  { id: 'shop', label: '商城', icon: ShoppingBag },
  { id: 'myteapet', label: '我的', icon: UserCircle }
];

function TabBar() {
  const { currentPage, setCurrentPage } = useAppStore();
  
  return (
    <div className="bg-[#F5F0E6] border-t border-[#E8E2D5]">
      <div className="max-w-[430px] mx-auto">
        <div className="flex items-center justify-around py-1.5 px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPage === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setCurrentPage(tab.id)}
                className="relative flex flex-col items-center justify-center py-1 px-0.5 min-w-[44px]"
                whileTap={{ scale: 0.9 }}
              >
                <div 
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#8FBC6B] shadow-md' 
                      : 'bg-transparent'
                  }`}
                >
                  <Icon 
                    size={18} 
                    className={`transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-[#9A8B7A]'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span className={`text-[9px] mt-0.5 font-medium transition-colors ${
                  isActive ? 'text-[#8FBC6B]' : 'text-[#9A8B7A]'
                }`}>
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
        {/* 安全区域 */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}

export default App;
