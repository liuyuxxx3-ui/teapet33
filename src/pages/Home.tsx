import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { X, LogIn } from 'lucide-react';

export function Home() {
  const { setCurrentPage } = useAppStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // 检查登录状态
  useEffect(() => {
    // 从本地存储中获取登录状态
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(savedLoginStatus === 'true');
    // 加载后不自动弹出登录弹窗，只有当用户点击进入茶舍按钮时才弹出
  }, []);
  
  // 处理登录
  const handleLogin = () => {
    // 这里简化处理，实际项目中应该调用登录API
    if (username && password) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      // 保存登录状态到本地存储
      localStorage.setItem('isLoggedIn', 'true');
      // 保存用户数据到本地存储
      const userData = {
        username: username,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      // 登录成功后直接跳转到茶宠选择页面
      setCurrentPage('teaPetSelector');
    }
  };
  
  // 处理进入茶舍
  const handleEnterTeaHouse = () => {
    if (isLoggedIn) {
      setCurrentPage('teaPetSelector');
    } else {
      setShowLoginModal(true);
    }
  };
  
  return (
    <div className="h-full w-full relative overflow-hidden flex flex-col">
      {/* 背景图 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/bg-home.jpg)' }}
      />
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F5F0E6]/90 via-transparent to-[#F5F0E6]/30" />
      
      {/* 内容 */}
      <div className="relative flex-1 flex flex-col items-center justify-end pb-24 px-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-[#5C4A3A] mb-2">茗茶宠舍</h1>
          <p className="text-sm text-[#9A8B7A]">虚实共生 · 数字茶宠养成</p>
        </motion.div>
        
        {/* 入口按钮 */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleEnterTeaHouse}
          className="leaf-btn text-white py-4 px-12 rounded-2xl font-bold text-lg"
          whileTap={{ scale: 0.95 }}
        >
          进入茶舍
        </motion.button>
        
        {/* 装饰文字 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-xs text-[#9A8B7A]"
        >
          养一只属于你的数字茶宠
        </motion.p>
      </div>
      
      {/* 登录弹窗 */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[320px] bg-[#FFFEF8] rounded-3xl p-6 border-2 border-[#E8E2D5]">
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowLoginModal(false)}>
              <X size={20} className="text-[#9A8B7A]" />
            </button>
          </div>
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-[#8FBC6B]/20 rounded-full flex items-center justify-center mb-3">
              <LogIn size={32} className="text-[#7AA857]" />
            </div>
            <h3 className="font-bold text-[#5C4A3A] mb-1">账号登录</h3>
            <p className="text-sm text-[#9A8B7A]">登录后享受更多功能</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                className="w-full px-4 py-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full px-4 py-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
              />
            </div>
          </div>
          
          <motion.button
            onClick={handleLogin}
            className="w-full leaf-btn text-white py-3 rounded-xl font-medium"
            whileTap={{ scale: 0.98 }}
          >
            登录
          </motion.button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
