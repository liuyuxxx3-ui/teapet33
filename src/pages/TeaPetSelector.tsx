import { motion } from 'framer-motion';
import { ScanLine } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAppStore } from '@/stores/appStore';

export function TeaPetSelector() {
  const { teaPets, currentTeaPetId, selectTeaPet, setCurrentPage, addTeaPet } = useAppStore();
  
  // 选择茶宠
  const handleSelectTeaPet = (teaPetId: string) => {
    selectTeaPet(teaPetId);
    setCurrentPage('nurture');
  };
  
  // 模拟添加新茶宠
  const handleAddTeaPet = () => {
    // 这里应该跳转到扫描页面，这里模拟添加一个新茶宠
    const newTeaPet = {
      id: Date.now().toString(),
      name: `茶宠${teaPets.length + 1}`,
      stage: 'baby' as const,
      level: 1,
      aura: 0,
      moisture: 50,
      intimacy: 0,
      skin: 'default',
      createdAt: new Date(),
      image: '/images/tea-pet-stage-1.png'
    };
    addTeaPet(newTeaPet);
  };
  
  return (
    <MobileLayout
      navBarProps={{
        title: '选择茶宠',
        showBack: true,
        onBack: () => setCurrentPage('home')
      }}
      className="bg-[#F5F0E6]"
    >
      <div className="px-4 py-6 pb-20">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-[#5C4A3A] mb-2">我的茶宠</h1>
          <p className="text-sm text-[#9A8B7A]">选择你要养护的茶宠</p>
        </motion.div>
        
        {/* 茶宠列表 */}
        <div className="space-y-4">
          {teaPets.map((teaPet, index) => (
            <motion.div
              key={teaPet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleSelectTeaPet(teaPet.id)}
              className={`p-4 rounded-2xl border-2 transition-all ${currentTeaPetId === teaPet.id ? 'border-[#8FBC6B] bg-[#8FBC6B]/5' : 'border-[#E8E2D5] bg-white'}`}
            >
              <div className="flex items-center gap-4">
                {/* 茶宠图片 */}
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#F5F0E6] to-[#E8E2D5] flex items-center justify-center">
                  <img 
                    src={teaPet.image} 
                    alt={teaPet.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                
                {/* 茶宠信息 */}
                <div className="flex-1">
                  <h3 className="font-bold text-[#5C4A3A] text-lg mb-1">{teaPet.name}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#9A8B7A]">Lv.{teaPet.level}</span>
                    <span className="text-[#8FBC6B]">灵气: {teaPet.aura}</span>
                    <span className="text-[#7AA857]">润泽: {teaPet.moisture}%</span>
                  </div>
                </div>
                
                {/* 选中状态 */}
                {currentTeaPetId === teaPet.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-6 h-6 rounded-full bg-[#8FBC6B] flex items-center justify-center"
                  >
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* 添加新茶宠 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: teaPets.length * 0.1 }}
            onClick={handleAddTeaPet}
            className="p-4 rounded-2xl border-2 border-dashed border-[#E8E2D5] bg-white flex items-center justify-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#8FBC6B]/10 flex items-center justify-center">
              <ScanLine size={20} className="text-[#8FBC6B]" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-[#5C4A3A] text-sm">添加新茶宠</h3>
              <p className="text-[10px] text-[#9A8B7A]">扫描茶宠二维码</p>
            </div>
          </motion.div>
        </div>
        
        {/* 提示信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-[#9A8B7A]">提示：点击茶宠卡片进入养成界面</p>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
