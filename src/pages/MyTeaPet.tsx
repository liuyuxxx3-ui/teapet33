import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Droplets, Heart, ShoppingCart, 
  Trash2, X, Edit
} from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAppStore } from '@/stores/appStore';
import { evolutionStages } from '@/data/user';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

export function MyTeaPet() {
  const { teaPets, currentTeaPetId, user, cart, removeFromCart, setTeaPet, setCurrentPage, designs } = useAppStore();
  
  // 获取当前选中的茶宠
  const teaPet = teaPets.find(tp => tp.id === currentTeaPetId) || teaPets[0];
  const [showCartModal, setShowCartModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newTeaPetName, setNewTeaPetName] = useState(teaPet.name);
  // 商家联系和人工客服相关状态
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: '你好，有什么可以帮助你的吗？', sender: 'merchant' },
    { id: 2, text: '我想了解一下茶宠的养护方法', sender: 'user' }
  ]);
  const [serviceMessages, setServiceMessages] = useState([
    { id: 1, text: '你好，我是AI客服，有什么可以帮助你的吗？', sender: 'ai' },
    { id: 2, text: '如何提高茶宠的灵气值？', sender: 'user' },
    { id: 3, text: '你可以通过每天打卡、互动玩耍和喂食来提高茶宠的灵气值。', sender: 'ai' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [newServiceMessage, setNewServiceMessage] = useState('');
  
  const currentStage = evolutionStages.find(s => 
    s.stage === (teaPet.stage === 'baby' ? 1 : teaPet.stage === 'juvenile' ? 2 : 3)
  );
  
  // 计算购物车总价
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  
  // 处理修改茶宠名字
  const handleRenameTeaPet = () => {
    if (newTeaPetName.trim()) {
      setTeaPet({
        ...teaPet,
        name: newTeaPetName.trim()
      });
      setShowRenameModal(false);
    }
  };
  
  // 当茶宠变化时更新名字输入框
  useEffect(() => {
    setNewTeaPetName(teaPet.name);
  }, [teaPet]);
  
  // 获取当前茶宠的设计图
  const teaPetDesigns = designs.filter(design => design.teaPetId === teaPet.id);
  
  return (
    <MobileLayout
      navBarProps={{ 
        title: '茶宠管理', 
        showBack: true,
        rightContent: (
          <div className="flex gap-1">
            <motion.button
              onClick={() => setCurrentPage('account')}
              className="w-8 h-8 rounded-full bg-[#E8E2D5]/80 flex items-center justify-center relative"
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-[#5C4A3A] font-bold text-lg">👤</span>
            </motion.button>
          </div>
        )
      }}
      className="bg-[#F5F0E6]"
    >
      {/* 茶宠展示区 */}
      <div className="px-4 pt-2">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 背景光晕 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-[#8FBC6B]/10 rounded-full blur-2xl animate-pulse" />
          </div>
          
          {/* 茶宠形象 */}
          <div className="relative flex flex-col items-center">
            <motion.div
              className="relative w-40 h-40"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src={teaPet.image} 
                alt={teaPet.name}
                className="w-full h-full object-contain drop-shadow-lg"
              />
              
              {/* 灵气粒子效果 */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-[#8FBC6B]/50 rounded-full"
                    style={{
                      left: `${20 + i * 18}%`,
                      bottom: `${10 + i * 8}%`
                    }}
                    animate={{
                      y: [-15, -45],
                      opacity: [0.8, 0],
                      scale: [1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* 茶宠信息 */}
            <div className="mt-3 text-center">
              <h1 className="text-xl font-bold text-[#5C4A3A]">{teaPet.name}</h1>
              <p className="text-xs text-[#9A8B7A] mt-1">{currentStage?.name} · 阶段 {currentStage?.stage}/3</p>
            </div>
          </div>
        </motion.div>
        
        {/* 属性卡片 */}
        <motion.div 
          className="mt-4 grid grid-cols-3 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* 灵气值 */}
          <div className="cozy-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sparkles size={14} className="text-[#C4A77D]" />
              <span className="text-[10px] text-[#9A8B7A]">灵气值</span>
            </div>
            <p className="text-lg font-bold text-[#5C4A3A]">{teaPet.aura}</p>
            <div className="mt-1 h-1 bg-[#E8E2D5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#C4A77D] to-[#8FBC6B] rounded-full"
                style={{ width: `${Math.min(teaPet.aura / 15, 100)}%` }}
              />
            </div>
          </div>
          
          {/* 润泽度 */}
          <div className="cozy-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Droplets size={14} className="text-[#8FBC6B]" />
              <span className="text-[10px] text-[#9A8B7A]">润泽度</span>
            </div>
            <p className="text-lg font-bold text-[#5C4A3A]">{teaPet.moisture}%</p>
            <div className="mt-1 h-1 bg-[#E8E2D5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#8FBC6B] to-[#7AA857] rounded-full"
                style={{ width: `${teaPet.moisture}%` }}
              />
            </div>
          </div>
          
          {/* 亲密度 */}
          <div className="cozy-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Heart size={14} className="text-[#E8A87C]" />
              <span className="text-[10px] text-[#9A8B7A]">亲密度</span>
            </div>
            <p className="text-lg font-bold text-[#5C4A3A]">{teaPet.intimacy}</p>
            <div className="mt-1 h-1 bg-[#E8E2D5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#E8A87C] to-[#D4956A] rounded-full"
                style={{ width: `${teaPet.intimacy}%` }}
              />
            </div>
          </div>
        </motion.div>
        
        {/* 功能按钮区 */}
        <motion.div 
          className="mt-4 grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* 修改名字 */}
          <motion.button
            onClick={() => setShowRenameModal(true)}
            className="cozy-card p-4 flex items-center gap-3"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-[#E8A87C]/20 rounded-xl flex items-center justify-center">
              <Edit size={20} className="text-[#E8A87C]" />
            </div>
            <div className="text-left">
              <p className="font-medium text-[#5C4A3A] text-sm">修改名字</p>
              <p className="text-[10px] text-[#9A8B7A]">为茶宠起个新名字</p>
            </div>
          </motion.button>
          
          {/* 切换茶宠 */}
          <motion.button
            onClick={() => setCurrentPage('teaPetSelector')}
            className="cozy-card p-4 flex items-center gap-3"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-[#8FBC6B]/20 rounded-xl flex items-center justify-center">
              <span className="text-[#8FBC6B] font-bold text-lg">🐱</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-[#5C4A3A] text-sm">切换茶宠</p>
              <p className="text-[10px] text-[#9A8B7A]">管理多个茶宠</p>
            </div>
          </motion.button>
          
          {/* 商家联系 */}
          <motion.button
            onClick={() => setShowMerchantModal(true)}
            className="cozy-card p-4 flex items-center gap-3"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-[#C4A77D]/20 rounded-xl flex items-center justify-center">
              <span className="text-[#C4A77D] font-bold text-lg">💬</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-[#5C4A3A] text-sm">商家联系</p>
              <p className="text-[10px] text-[#9A8B7A]">与商家进行对话</p>
            </div>
          </motion.button>
          
          {/* 人工客服 */}
          <motion.button
            onClick={() => setShowServiceModal(true)}
            className="cozy-card p-4 flex items-center gap-3"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-[#8FBC6B]/20 rounded-xl flex items-center justify-center">
              <span className="text-[#8FBC6B] font-bold text-lg">🤖</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-[#5C4A3A] text-sm">人工客服</p>
              <p className="text-[10px] text-[#9A8B7A]">AI智能问答</p>
            </div>
          </motion.button>
        </motion.div>
        
        {/* 设计图展示 */}
        <motion.div 
          className="mt-3 cozy-card p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#5C4A3A] text-sm">设计图</h3>
            <motion.button
              onClick={() => setCurrentPage('workshop')}
              className="text-xs text-[#8FBC6B]"
              whileTap={{ scale: 0.95 }}
            >
              去工坊
            </motion.button>
          </div>
          {teaPetDesigns.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {teaPetDesigns.slice(0, 3).map((design) => (
                <div key={design.id} className="aspect-square bg-[#F5F0E6] rounded-xl overflow-hidden">
                  <img 
                    src={design.image} 
                    alt={design.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[10px] text-[#9A8B7A]">暂无设计图</p>
              <motion.button
                onClick={() => setCurrentPage('workshop')}
                className="mt-2 text-xs text-[#8FBC6B]"
                whileTap={{ scale: 0.95 }}
              >
                去工坊创建
              </motion.button>
            </div>
          )}
        </motion.div>
        
        {/* 连续打卡 */}
        <motion.div 
          className="mt-3 cozy-card p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#8FBC6B] rounded-xl flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-[#5C4A3A] text-sm">连续打卡 {user.checkInStreak} 天</p>
                <p className="text-[10px] text-[#9A8B7A]">坚持养护，茶宠成长更快</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* 购物车弹窗 */}
      <Dialog open={showCartModal} onOpenChange={setShowCartModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[360px] bg-[#FFFEF8] rounded-3xl p-0 border-2 border-[#E8E2D5] max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b border-[#E8E2D5]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#5C4A3A]">购物车 ({cart.length})</h3>
              <button onClick={() => setShowCartModal(false)}>
                <X size={20} className="text-[#9A8B7A]" />
              </button>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[50vh]">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart size={48} className="mx-auto text-[#E8E2D5] mb-3" />
                <p className="text-[#9A8B7A]">购物车是空的</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-center gap-3 p-3 bg-[#F5F0E6] rounded-xl">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-[#5C4A3A] text-sm">{item.name}</p>
                      <p className="text-[#8FBC6B] font-bold">¥{item.price}</p>
                    </div>
                    <motion.button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 bg-[#E8E2D5] rounded-full flex items-center justify-center"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={14} className="text-[#9A8B7A]" />
                    </motion.button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="p-4 border-t border-[#E8E2D5] bg-[#F5F0E6]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#9A8B7A]">合计</span>
                <span className="text-xl font-bold text-[#5C4A3A]">¥{cartTotal}</span>
              </div>
              <motion.button
                onClick={() => setCurrentPage('account')}
                className="w-full leaf-btn text-white py-3 rounded-xl font-medium"
                whileTap={{ scale: 0.98 }}
              >
                去结算
              </motion.button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* 修改茶宠名字弹窗 */}
      <Dialog open={showRenameModal} onOpenChange={setShowRenameModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[320px] bg-[#FFFEF8] rounded-3xl p-6 border-2 border-[#E8E2D5]">
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowRenameModal(false)}>
              <X size={20} className="text-[#9A8B7A]" />
            </button>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-[#5C4A3A] mb-6">修改茶宠名字</h3>
            
            <div className="mb-6">
              <input
                type="text"
                value={newTeaPetName}
                onChange={(e) => setNewTeaPetName(e.target.value)}
                placeholder="请输入新名字"
                className="w-full px-4 py-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
                maxLength={10}
              />
            </div>
            
            <motion.button
              onClick={handleRenameTeaPet}
              className="w-full leaf-btn text-white py-3 rounded-xl font-medium"
              whileTap={{ scale: 0.98 }}
            >
              确认修改
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 商家联系弹窗 */}
      <Dialog open={showMerchantModal} onOpenChange={setShowMerchantModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[360px] bg-[#FFFEF8] rounded-3xl p-0 border-2 border-[#E8E2D5] max-h-[90vh] overflow-hidden">
          <div className="p-4 border-b border-[#E8E2D5]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#5C4A3A] text-sm">商家联系</h3>
              <button onClick={() => setShowMerchantModal(false)}>
                <X size={18} className="text-[#9A8B7A]" />
              </button>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-lg ${message.sender === 'user' ? 'bg-[#8FBC6B] text-white' : 'bg-[#F5F0E6] text-[#5C4A3A]'}`}>
                  <p className="text-xs">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-[#E8E2D5]">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="输入消息..."
                className="flex-1 px-4 py-2 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
              />
              <motion.button
                onClick={() => {
                  if (newMessage.trim()) {
                    setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: 'user' }]);
                    setNewMessage('');
                    // 模拟商家回复
                    setTimeout(() => {
                      setMessages(prev => [...prev, { id: prev.length + 1, text: '好的，我会尽快处理你的问题。', sender: 'merchant' }]);
                    }, 1000);
                  }
                }}
                className="w-10 h-10 bg-[#8FBC6B] rounded-full flex items-center justify-center text-white"
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-sm">➤</span>
              </motion.button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 人工客服弹窗 */}
      <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[360px] bg-[#FFFEF8] rounded-3xl p-0 border-2 border-[#E8E2D5] max-h-[90vh] overflow-hidden">
          <div className="p-4 border-b border-[#E8E2D5]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#5C4A3A] text-sm">人工客服</h3>
              <button onClick={() => setShowServiceModal(false)}>
                <X size={18} className="text-[#9A8B7A]" />
              </button>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
            {serviceMessages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-lg ${message.sender === 'user' ? 'bg-[#8FBC6B] text-white' : 'bg-[#F5F0E6] text-[#5C4A3A]'}`}>
                  <p className="text-xs">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-[#E8E2D5]">
            <div className="flex gap-2">
              <input
                type="text"
                value={newServiceMessage}
                onChange={(e) => setNewServiceMessage(e.target.value)}
                placeholder="输入问题..."
                className="flex-1 px-4 py-2 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5] text-[#5C4A3A] text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBC6B]"
              />
              <motion.button
                onClick={() => {
                  if (newServiceMessage.trim()) {
                    setServiceMessages([...serviceMessages, { id: serviceMessages.length + 1, text: newServiceMessage, sender: 'user' }]);
                    setNewServiceMessage('');
                    // 模拟AI回复
                    setTimeout(() => {
                      setServiceMessages(prev => [...prev, { id: prev.length + 1, text: '感谢您的咨询，我会为您提供详细的解答。', sender: 'ai' }]);
                    }, 1000);
                  }
                }}
                className="w-10 h-10 bg-[#8FBC6B] rounded-full flex items-center justify-center text-white"
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-sm">➤</span>
              </motion.button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
