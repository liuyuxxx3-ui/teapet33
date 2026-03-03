import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ScanLine, ShoppingCart, Trash2, Wallet, X, LogIn, User, Settings
} from 'lucide-react';
import QRCode from 'qrcode';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAppStore } from '@/stores/appStore';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

export function Account() {
  const { user, cart, removeFromCart, addPoints, setCurrentPage } = useAppStore();
  
  // 账号管理相关状态
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'recharge' | 'cart'>('recharge');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [qrcodeData, setQrcodeData] = useState<string>('');
  const [rechargeAmount, setRechargeAmount] = useState(100);
  const [username, setUsername] = useState('user');
  const [password, setPassword] = useState('');
  // 用户数据
  const [userData, setUserData] = useState<any>({
    username: 'user',
    loginTime: new Date().toISOString()
  });
  // 个人设置相关状态
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [userProfile, setUserProfile] = useState({
    avatar: '',
    nickname: '用户',
    gender: '未知',
    age: '',
    bio: ''
  });
  // 收货地址相关状态
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园路1号',
      isDefault: true
    }
  ]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    id: 0,
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
  // 优惠券管理相关状态
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      name: '新用户优惠券',
      value: 10,
      minSpend: 50,
      expiryDate: '2026-12-31',
      status: 'active'
    },
    {
      id: 2,
      name: '满减优惠券',
      value: 20,
      minSpend: 100,
      expiryDate: '2026-12-31',
      status: 'active'
    },
    {
      id: 3,
      name: '限时优惠券',
      value: 5,
      minSpend: 30,
      expiryDate: '2026-06-30',
      status: 'active'
    }
  ]);
  
  // 计算购物车总价
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  
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
      setUserData(userData);
      // 登录成功后跳转到茶宠选择页面
      setCurrentPage('teaPetSelector');
    }
  };
  
  // 处理个人设置保存
  const handleSaveSettings = () => {
    // 这里简化处理，实际项目中应该调用API保存设置
    console.log('保存个人设置:', userProfile);
    setShowSettingsModal(false);
  };
  
  // 处理扫码绑定
  const handleScan = () => {
    // 模拟扫码绑定过程
    setTimeout(() => {
      // 绑定成功
      setTimeout(() => {
        setShowScanModal(false);
      }, 1500);
    }, 2000);
  };
  
  // 处理积分充值
  const handleRecharge = () => {
    setPaymentType('recharge');
    setPaymentAmount(rechargeAmount);
    setShowRechargeModal(false);
    setShowPaymentModal(true);
  };
  
  // 处理购物车结算
  const handleCheckout = () => {
    setPaymentType('cart');
    setPaymentAmount(cartTotal);
    setShowPaymentModal(true);
  };
  
  // 处理付款完成
  const handlePaymentComplete = () => {
    if (paymentType === 'recharge') {
      addPoints(paymentAmount);
    } else if (paymentType === 'cart') {
      // 这里可以添加购物车结算的逻辑
    }
    setShowPaymentModal(false);
  };
  
  // 生成随机二维码
  useEffect(() => {
    if (showPaymentModal) {
      // 生成随机数据
      const randomData = `payment:${paymentType}:${paymentAmount}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
      
      // 生成二维码
      QRCode.toDataURL(randomData, { width: 160 })
        .then(url => {
          setQrcodeData(url);
        })
        .catch(err => {
          console.error('生成二维码失败:', err);
        });
    }
  }, [showPaymentModal, paymentType, paymentAmount]);
  
  // 检查登录状态和用户数据
  const checkLoginStatus = () => {
    // 从本地存储中获取登录状态
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    if (savedLoginStatus) {
      setIsLoggedIn(savedLoginStatus === 'true');
    }
    
    // 从本地存储中获取用户数据
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setUsername(JSON.parse(savedUserData).username);
    }
  };
  
  // 组件挂载时检查登录状态
  useEffect(() => {
    checkLoginStatus();
  }, []);
  
  // 监听存储事件变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isLoggedIn' || e.key === 'userData') {
        checkLoginStatus();
      }
    };
    
    // 添加存储事件监听器
    window.addEventListener('storage', handleStorageChange);
    
    // 清理监听器
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // 保存登录状态到本地存储
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);
  
  return (
    <MobileLayout
      navBarProps={{ 
        title: '账号管理', 
        showBack: true,
        rightContent: (
          <div className="flex gap-1">
            <motion.button
              onClick={() => setShowLoginModal(true)}
              className="w-8 h-8 rounded-full bg-[#E8E2D5]/80 flex items-center justify-center relative"
              whileTap={{ scale: 0.9 }}
            >
              <Settings size={16} className="text-[#5C4A3A]" />
            </motion.button>
          </div>
        )
      }}
      className="bg-[#F5F0E6]"
    >
      {/* 账号信息区 */}
      <motion.div 
        className="px-4 pt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="cozy-card p-4 flex items-center gap-4">
          <div className="w-16 h-16 bg-[#8FBC6B]/20 rounded-full flex items-center justify-center">
            <User size={32} className="text-[#7AA857]" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-[#5C4A3A] text-lg">{isLoggedIn ? userData?.username || '用户账号' : '未登录'}</h2>
            <p className="text-xs text-[#9A8B7A] mt-1">
              {isLoggedIn ? `登录时间: ${userData?.loginTime ? new Date(userData.loginTime).toLocaleString() : ''}` : '点击登录/注册'}
            </p>
          </div>
          <motion.button
            onClick={() => {
              if (isLoggedIn) {
                // 退出登录
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userData');
                setIsLoggedIn(false);
                setUserData(null);
                setUsername('');
              } else {
                setShowLoginModal(true);
              }
            }}
            className="px-4 py-2 bg-[#8FBC6B] text-white rounded-full text-sm font-medium"
            whileTap={{ scale: 0.95 }}
          >
            {isLoggedIn ? '退出' : '登录'}
          </motion.button>
        </div>
      </motion.div>
      
      {/* 功能按钮区 */}
      <motion.div 
        className="mt-4 grid grid-cols-2 gap-3 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* 扫码绑定 */}
        <motion.button
          onClick={() => setShowScanModal(true)}
          className="cozy-card p-4 flex items-center gap-3"
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 bg-[#8FBC6B]/20 rounded-xl flex items-center justify-center">
            <ScanLine size={20} className="text-[#7AA857]" />
          </div>
          <div className="text-left">
            <p className="font-medium text-[#5C4A3A] text-sm">扫码绑定</p>
            <p className="text-[10px] text-[#9A8B7A]">绑定实体茶宠</p>
          </div>
        </motion.button>
        
        {/* 积分充值 */}
        <motion.button
          onClick={() => setShowRechargeModal(true)}
          className="cozy-card p-4 flex items-center gap-3"
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 bg-[#C4A77D]/20 rounded-xl flex items-center justify-center">
            <Wallet size={20} className="text-[#B0956D]" />
          </div>
          <div className="text-left">
            <p className="font-medium text-[#5C4A3A] text-sm">积分充值</p>
            <p className="text-[10px] text-[#9A8B7A]">当前: {user.points}</p>
          </div>
        </motion.button>
        

        
        {/* 优惠券管理 */}
        <motion.button
          onClick={() => setShowCouponModal(true)}
          className="cozy-card p-4 flex items-center gap-3"
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 bg-[#E8A87C]/20 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 text-[#E8A87C] font-bold">券</div>
          </div>
          <div className="text-left">
            <p className="font-medium text-[#5C4A3A] text-sm">优惠券管理</p>
            <p className="text-[10px] text-[#9A8B7A]">查看和使用优惠券</p>
          </div>
        </motion.button>
        
        {/* 个人设置 */}
        <motion.button
          onClick={() => setShowSettingsModal(true)}
          className="cozy-card p-4 flex items-center gap-3"
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 bg-[#8FBC6B]/20 rounded-xl flex items-center justify-center">
            <Settings size={20} className="text-[#7AA857]" />
          </div>
          <div className="text-left">
            <p className="font-medium text-[#5C4A3A] text-sm">个人设置</p>
            <p className="text-[10px] text-[#9A8B7A]">账号信息管理</p>
          </div>
        </motion.button>
      </motion.div>
      
      {/* 购物车预览 */}
      {cart.length > 0 && (
        <motion.div 
          className="mt-4 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="cozy-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#5C4A3A]">购物车 ({cart.length})</h3>
              <span className="text-[#8FBC6B] font-bold">¥{cartTotal}</span>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {cart.slice(0, 3).map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center gap-2 p-2 bg-[#F5F0E6] rounded-xl">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-[#5C4A3A] text-xs">{item.name}</p>
                    <p className="text-[#8FBC6B] font-bold text-xs">¥{item.price}</p>
                  </div>
                  <motion.button
                    onClick={() => removeFromCart(item.id)}
                    className="w-6 h-6 bg-[#E8E2D5] rounded-full flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={12} className="text-[#9A8B7A]" />
                  </motion.button>
                </div>
              ))}
              {cart.length > 3 && (
                <div className="text-center text-xs text-[#9A8B7A] py-2">
                  还有 {cart.length - 3} 件商品...
                </div>
              )}
            </div>
            <motion.button
              onClick={handleCheckout}
              className="w-full leaf-btn text-white py-3 rounded-xl font-medium mt-3"
              whileTap={{ scale: 0.98 }}
            >
              去结算
            </motion.button>
          </div>
        </motion.div>
      )}
      
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
      
      {/* 扫码绑定弹窗 */}
      <Dialog open={showScanModal} onOpenChange={setShowScanModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[320px] bg-[#FFFEF8] rounded-3xl p-6 border-2 border-[#E8E2D5]">
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowScanModal(false)}>
              <X size={20} className="text-[#9A8B7A]" />
            </button>
          </div>
          <div className="text-center">
            <div className="w-48 h-48 mx-auto bg-[#F5F0E6] rounded-2xl flex items-center justify-center mb-4">
              <ScanLine size={64} className="text-[#9A8B7A]" />
            </div>
            <p className="text-[#5C4A3A] font-medium mb-4">扫描茶宠二维码</p>
            <motion.button
              onClick={handleScan}
              className="leaf-btn text-white py-3 px-8 rounded-xl font-medium"
              whileTap={{ scale: 0.95 }}
            >
              开始扫描
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 积分充值弹窗 */}
      <Dialog open={showRechargeModal} onOpenChange={setShowRechargeModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[320px] bg-[#FFFEF8] rounded-3xl p-6 border-2 border-[#E8E2D5]">
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowRechargeModal(false)}>
              <X size={20} className="text-[#9A8B7A]" />
            </button>
          </div>
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-[#C4A77D]/20 rounded-full flex items-center justify-center mb-3">
              <Wallet size={32} className="text-[#B0956D]" />
            </div>
            <h3 className="font-bold text-[#5C4A3A] mb-1">积分充值</h3>
            <p className="text-sm text-[#9A8B7A]">当前积分: {user.points}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[50, 100, 200, 500, 1000, 2000].map((amount) => (
              <motion.button
                key={amount}
                onClick={() => setRechargeAmount(amount)}
                className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                  rechargeAmount === amount
                    ? 'bg-[#8FBC6B] text-white'
                    : 'bg-[#F5F0E6] text-[#5C4A3A]'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {amount}
              </motion.button>
            ))}
          </div>
          
          <motion.button
            onClick={handleRecharge}
            className="w-full leaf-btn text-white py-3 rounded-xl font-medium"
            whileTap={{ scale: 0.98 }}
          >
            充值 {rechargeAmount} 积分
          </motion.button>
        </DialogContent>
      </Dialog>
      
      {/* 付款二维码弹窗 */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[320px] bg-[#FFFEF8] rounded-3xl p-6 border-2 border-[#E8E2D5]">
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowPaymentModal(false)}>
              <X size={20} className="text-[#9A8B7A]" />
            </button>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-[#5C4A3A] mb-4">{paymentType === 'recharge' ? '积分充值' : '购物车结算'}</h3>
            <p className="text-sm text-[#9A8B7A] mb-6">金额: ¥{paymentAmount}</p>
            
            {/* 二维码区域 */}
            <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center mb-6 border border-[#E8E2D5]">
              {qrcodeData ? (
                <img 
                  src={qrcodeData} 
                  alt="付款二维码" 
                  className="w-40 h-40 object-contain"
                />
              ) : (
                <div className="w-40 h-40 bg-[#F5F0E6] rounded flex items-center justify-center">
                  <p className="text-xs text-[#9A8B7A]">生成二维码中...</p>
                </div>
              )}
            </div>
            
            <p className="text-sm text-[#9A8B7A] mb-6">请使用微信/支付宝扫描二维码付款</p>
            
            <motion.button
              onClick={handlePaymentComplete}
              className="w-full leaf-btn text-white py-3 rounded-xl font-medium"
              whileTap={{ scale: 0.98 }}
            >
              确认付款
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 个人设置弹窗 */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[320px] bg-[#FFFEF8] rounded-3xl p-6 border-2 border-[#E8E2D5]">
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowSettingsModal(false)}>
              <X size={20} className="text-[#9A8B7A]" />
            </button>
          </div>
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-[#8FBC6B]/20 rounded-full flex items-center justify-center mb-3">
              {userProfile.avatar ? (
                <img 
                  src={userProfile.avatar} 
                  alt="头像" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={40} className="text-[#7AA857]" />
              )}
            </div>
            <h3 className="font-bold text-[#5C4A3A] mb-1">个人设置</h3>
            <p className="text-sm text-[#9A8B7A]">编辑个人信息</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs text-[#9A8B7A] mb-1">昵称</label>
              <input
                type="text"
                value={userProfile.nickname}
                onChange={(e) => setUserProfile({ ...userProfile, nickname: e.target.value })}
                placeholder="请输入昵称"
                className="w-full px-4 py-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#9A8B7A] mb-1">性别</label>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setUserProfile({ ...userProfile, gender: '男' })}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    userProfile.gender === '男'
                      ? 'bg-[#8FBC6B] text-white'
                      : 'bg-[#F5F0E6] text-[#5C4A3A]'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  男
                </motion.button>
                <motion.button
                  onClick={() => setUserProfile({ ...userProfile, gender: '女' })}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    userProfile.gender === '女'
                      ? 'bg-[#8FBC6B] text-white'
                      : 'bg-[#F5F0E6] text-[#5C4A3A]'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  女
                </motion.button>
                <motion.button
                  onClick={() => setUserProfile({ ...userProfile, gender: '未知' })}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    userProfile.gender === '未知'
                      ? 'bg-[#8FBC6B] text-white'
                      : 'bg-[#F5F0E6] text-[#5C4A3A]'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  未知
                </motion.button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#9A8B7A] mb-1">年龄</label>
              <input
                type="number"
                value={userProfile.age}
                onChange={(e) => setUserProfile({ ...userProfile, age: e.target.value })}
                placeholder="请输入年龄"
                className="w-full px-4 py-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#9A8B7A] mb-1">个人简介</label>
              <textarea
                value={userProfile.bio}
                onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                placeholder="请输入个人简介"
                rows={3}
                className="w-full px-4 py-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
              />
            </div>
          </div>
          
          {/* 收货地址管理 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-[#5C4A3A] text-sm">收货地址</h4>
              <motion.button
                onClick={() => {
                  setIsEditingAddress(false);
                  setCurrentAddress({
                    id: 0,
                    name: '',
                    phone: '',
                    province: '',
                    city: '',
                    district: '',
                    detail: '',
                    isDefault: false
                  });
                  setShowAddressModal(true);
                }}
                className="text-[#8FBC6B] text-xs font-medium"
                whileTap={{ scale: 0.95 }}
              >
                添加地址
              </motion.button>
            </div>
            <div className="space-y-2">
              {addresses.map((address) => (
                <div key={address.id} className="cozy-card p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[#5C4A3A] text-xs">{address.name}</p>
                        <p className="text-xs text-[#9A8B7A]">{address.phone}</p>
                        {address.isDefault && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#8FBC6B]/20 text-[#8FBC6B] rounded-full">默认</span>
                        )}
                      </div>
                      <p className="text-xs text-[#5C4A3A] mt-1.5">
                        {address.province}{address.city}{address.district}{address.detail}
                      </p>
                    </div>
                    <div className="flex gap-1.5 ml-2">
                      <motion.button
                        onClick={() => {
                          setIsEditingAddress(true);
                          setCurrentAddress(address);
                          setShowAddressModal(true);
                        }}
                        className="w-7 h-7 bg-[#E8E2D5] rounded-full flex items-center justify-center"
                        whileTap={{ scale: 0.9 }}
                      >
                        <span className="text-[10px]">编辑</span>
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setAddresses(addresses.filter((addr) => addr.id !== address.id));
                        }}
                        className="w-7 h-7 bg-[#E8E2D5] rounded-full flex items-center justify-center"
                        whileTap={{ scale: 0.9 }}
                      >
                        <span className="text-[10px]">删除</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <motion.button
            onClick={handleSaveSettings}
            className="w-full leaf-btn text-white py-3 rounded-xl font-medium"
            whileTap={{ scale: 0.98 }}
          >
            保存设置
          </motion.button>
        </DialogContent>
      </Dialog>
      
      {/* 优惠券管理弹窗 */}
      <Dialog open={showCouponModal} onOpenChange={setShowCouponModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[320px] bg-[#FFFEF8] rounded-3xl p-6 border-2 border-[#E8E2D5]">
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowCouponModal(false)}>
              <X size={20} className="text-[#9A8B7A]" />
            </button>
          </div>
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-[#E8A87C]/20 rounded-full flex items-center justify-center mb-3">
              <div className="text-2xl font-bold text-[#E8A87C]">券</div>
            </div>
            <h3 className="font-bold text-[#5C4A3A] mb-1">优惠券管理</h3>
            <p className="text-sm text-[#9A8B7A]">查看和使用您的优惠券</p>
          </div>
          
          <div className="space-y-3 mb-6">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="cozy-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#E8A87C] text-lg">¥{coupon.value}</p>
                  <p className="text-sm text-[#5C4A3A] mt-1">{coupon.name}</p>
                  <p className="text-xs text-[#9A8B7A] mt-1">满¥{coupon.minSpend}可用</p>
                  <p className="text-xs text-[#9A8B7A] mt-1">有效期至: {coupon.expiryDate}</p>
                </div>
                <div className="w-12 h-12 bg-[#E8A87C]/10 rounded-full flex items-center justify-center">
                  <div className="text-xs font-medium text-[#E8A87C]">可用</div>
                </div>
              </div>
            ))}
          </div>
          
          <motion.button
            onClick={() => setShowCouponModal(false)}
            className="w-full leaf-btn text-white py-3 rounded-xl font-medium"
            whileTap={{ scale: 0.98 }}
          >
            关闭
          </motion.button>
        </DialogContent>
      </Dialog>
      
      {/* 收货地址编辑弹窗 */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[320px] bg-[#FFFEF8] rounded-3xl p-6 border-2 border-[#E8E2D5]">
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowAddressModal(false)}>
              <X size={20} className="text-[#9A8B7A]" />
            </button>
          </div>
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-[#8FBC6B]/20 rounded-full flex items-center justify-center mb-3">
              <User size={32} className="text-[#7AA857]" />
            </div>
            <h3 className="font-bold text-[#5C4A3A] mb-1">{isEditingAddress ? '编辑收货地址' : '添加收货地址'}</h3>
            <p className="text-sm text-[#9A8B7A]">请填写收货地址信息</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs text-[#9A8B7A] mb-1">收货人</label>
              <input
                type="text"
                value={currentAddress.name}
                onChange={(e) => setCurrentAddress({ ...currentAddress, name: e.target.value })}
                placeholder="请输入收货人姓名"
                className="w-full px-4 py-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#9A8B7A] mb-1">手机号</label>
              <input
                type="tel"
                value={currentAddress.phone}
                onChange={(e) => setCurrentAddress({ ...currentAddress, phone: e.target.value })}
                placeholder="请输入手机号"
                className="w-full px-4 py-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#9A8B7A] mb-1">省份</label>
              <input
                type="text"
                value={currentAddress.province}
                onChange={(e) => setCurrentAddress({ ...currentAddress, province: e.target.value })}
                placeholder="请输入省份"
                className="w-full px-4 py-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#9A8B7A] mb-1">城市</label>
              <input
                type="text"
                value={currentAddress.city}
                onChange={(e) => setCurrentAddress({ ...currentAddress, city: e.target.value })}
                placeholder="请输入城市"
                className="w-full px-4 py-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#9A8B7A] mb-1">区县</label>
              <input
                type="text"
                value={currentAddress.district}
                onChange={(e) => setCurrentAddress({ ...currentAddress, district: e.target.value })}
                placeholder="请输入区县"
                className="w-full px-4 py-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#9A8B7A] mb-1">详细地址</label>
              <textarea
                value={currentAddress.detail}
                onChange={(e) => setCurrentAddress({ ...currentAddress, detail: e.target.value })}
                placeholder="请输入详细地址"
                rows={3}
                className="w-full px-4 py-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentAddress.isDefault}
                onChange={(e) => setCurrentAddress({ ...currentAddress, isDefault: e.target.checked })}
                className="w-4 h-4 text-[#8FBC6B]"
              />
              <label className="text-sm text-[#5C4A3A]">设为默认地址</label>
            </div>
          </div>
          
          <motion.button
            onClick={() => {
              if (isEditingAddress) {
                // 编辑现有地址
                setAddresses(addresses.map((addr) => 
                  addr.id === currentAddress.id ? currentAddress : addr
                ));
              } else {
                // 添加新地址
                const newAddress = {
                  ...currentAddress,
                  id: Math.max(...addresses.map((addr) => addr.id), 0) + 1
                };
                setAddresses([...addresses, newAddress]);
              }
              setShowAddressModal(false);
            }}
            className="w-full leaf-btn text-white py-3 rounded-xl font-medium"
            whileTap={{ scale: 0.98 }}
          >
            {isEditingAddress ? '保存修改' : '添加地址'}
          </motion.button>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
