import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Droplets, Heart, Camera, Check, Gift, Clock, Wallet, ScanLine, X } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAppStore } from '@/stores/appStore';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

export function Nurture() {
  const { teaPets, currentTeaPetId, user, addCheckIn, updateTeaPetStats, deductPoints, checkInRecords, evolveTeaPet, evolutionStages, updateEvolutionStages, designs, setCurrentPage } = useAppStore();
  
  // 获取当前选中的茶宠
  const teaPet = teaPets.find(tp => tp.id === currentTeaPetId) || teaPets[0];
  const [showCheckInSuccess, setShowCheckInSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'care' | 'evolution' | 'interaction'>('care');
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanStep, setScanStep] = useState<'scan' | 'binding' | 'success'>('scan');
  
  // 处理扫码绑定
  const handleScan = () => {
    setScanStep('binding');
    setTimeout(() => {
      setScanStep('success');
      setTimeout(() => {
        setShowScanModal(false);
        setScanStep('scan');
      }, 1500);
    }, 2000);
  };
  
  // 当茶宠属性变化时，更新进化阶段
  useEffect(() => {
    updateEvolutionStages();
  }, [teaPet.aura, teaPet.moisture, updateEvolutionStages]);
  
  // 检查今天的打卡次数
  const getTodayCheckInCount = (type: 'sensor' | 'photo' | 'daily') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return checkInRecords.filter(record => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime() && record.type === type;
    }).length;
  };
  
  // 检查是否可以打卡
  const canCheckIn = (type: 'sensor' | 'photo' | 'daily') => {
    if (type === 'photo') {
      return getTodayCheckInCount('photo') < 2;
    } else if (type === 'daily') {
      return getTodayCheckInCount('daily') < 1;
    }
    return true; // sensor类型无限制
  };
  

  
  // 获取当前茶宠的设计图
  const teaPetDesigns = designs.filter(design => design.teaPetId === teaPet.id);
  
  // 打卡处理
  const handleCheckIn = (type: 'sensor' | 'photo' | 'daily') => {
    if (!canCheckIn(type)) {
      return;
    }
    
    const points = type === 'daily' ? 10 : type === 'photo' ? 20 : 30;
    addCheckIn({
      date: new Date(),
      type,
      points
    });
    
    // 更新茶宠属性
    updateTeaPetStats({
      aura: teaPet.aura + points,
      moisture: Math.min(teaPet.moisture + 2, 100),
      intimacy: Math.min(teaPet.intimacy + 5, 100)
    });
    
    setShowCheckInSuccess(true);
    setTimeout(() => setShowCheckInSuccess(false), 2000);
  };
  
  return (
    <MobileLayout
      navBarProps={{ 
        title: '养成中心', 
        showBack: true,
        showScan: true,
        onScan: () => setShowScanModal(true)
      }}
      className="bg-[#F5F0E6]"
    >
      <div className="px-4 py-3 pb-20">
        {/* 标签切换 */}
        <div className="flex gap-2 bg-white/80 rounded-xl p-1 border border-[#E8E2D5] mb-4">
          {[
            { id: 'care', label: '日常养护' },
            { id: 'evolution', label: '形态进化' },
            { id: 'interaction', label: '互动玩耍' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[#8FBC6B] text-white' 
                  : 'text-[#9A8B7A] hover:text-[#5C4A3A]'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
        
        {/* 内容区 */}
        <AnimatePresence mode="wait">
          {/* 日常养护 */}
          {activeTab === 'care' && (
            <motion.div
              key="care"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* 茶宠展示区 */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* 背景光晕 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-80 bg-[#8FBC6B]/10 rounded-full blur-2xl animate-pulse" />
                </div>
                
                {/* 茶宠形象 */}
                <div className="relative flex flex-col items-center">
                  <motion.div
                    className="relative w-64 h-64 bg-gradient-to-br from-[#F5F0E6] to-[#E8E2D5] rounded-2xl p-6 border-2 border-[#C4A77D] shadow-lg"
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
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-[#8FBC6B]/50 rounded-full"
                          style={{
                            left: `${10 + i * 12}%`,
                            bottom: `${10 + i * 8}%`
                          }}
                          animate={{
                            y: [-30, -60],
                            opacity: [0.8, 0],
                            scale: [1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* 茶宠信息 */}
                  <div className="mt-4 text-center">
                    <h1 className="text-2xl font-bold text-[#5C4A3A]">{teaPet.name}</h1>
                    <p className="text-sm text-[#9A8B7A] mt-1">当前状态: 健康</p>
                  </div>
                </div>
              </motion.div>
              
              {/* 打卡方式 */}
              <div className="cozy-card p-4">
                <h3 className="font-semibold text-[#5C4A3A] mb-3 text-sm">选择打卡方式</h3>
                <div className="space-y-2">
                  <motion.button
                    onClick={() => handleCheckIn('sensor')}
                    className="w-full flex items-center gap-3 p-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5]"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-10 h-10 bg-[#8FBC6B] rounded-xl flex items-center justify-center">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-[#5C4A3A] text-sm">传感器自动打卡</p>
                      <p className="text-[10px] text-[#9A8B7A]">蓝牙连接，自动捕捉养护行为</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#8FBC6B]">+30</span>
                      <Sparkles size={10} className="inline ml-1 text-[#C4A77D]" />
                    </div>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleCheckIn('photo')}
                    disabled={!canCheckIn('photo')}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border ${canCheckIn('photo') ? 'bg-[#F5F0E6] border-[#E8E2D5]' : 'bg-[#E8E2D5] border-[#D8D2C5]'}`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${canCheckIn('photo') ? 'bg-[#C4A77D]' : 'bg-[#9A8B7A]'}`}>
                      <Camera size={20} className="text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-medium text-sm ${canCheckIn('photo') ? 'text-[#5C4A3A]' : 'text-[#9A8B7A]'}`}>AI拍照打卡</p>
                      <p className="text-[10px] text-[#9A8B7A]">上传养护照片，AI智能识别</p>
                      <p className="text-[10px] text-[#9A8B7A] mt-1">今日剩余: {2 - getTodayCheckInCount('photo')}次</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${canCheckIn('photo') ? 'text-[#C4A77D]' : 'text-[#9A8B7A]'}`}>+20</span>
                      <Sparkles size={10} className={`inline ml-1 ${canCheckIn('photo') ? 'text-[#C4A77D]' : 'text-[#9A8B7A]'}`} />
                    </div>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleCheckIn('daily')}
                    disabled={!canCheckIn('daily')}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border ${canCheckIn('daily') ? 'bg-[#F5F0E6] border-[#E8E2D5]' : 'bg-[#E8E2D5] border-[#D8D2C5]'}`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${canCheckIn('daily') ? 'bg-[#7A9E6E]' : 'bg-[#9A8B7A]'}`}>
                      <Check size={20} className="text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-medium text-sm ${canCheckIn('daily') ? 'text-[#5C4A3A]' : 'text-[#9A8B7A]'}`}>每日签到</p>
                      <p className="text-[10px] text-[#9A8B7A]">简单签到，领取基础积分</p>
                      <p className="text-[10px] text-[#9A8B7A] mt-1">今日剩余: {1 - getTodayCheckInCount('daily')}次</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${canCheckIn('daily') ? 'text-[#7A9E6E]' : 'text-[#9A8B7A]'}`}>+10</span>
                      <Sparkles size={10} className={`inline ml-1 ${canCheckIn('daily') ? 'text-[#C4A77D]' : 'text-[#9A8B7A]'}`} />
                    </div>
                  </motion.button>
                </div>
              </div>
              
              {/* 连续打卡奖励 */}
              <div className="cozy-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#5C4A3A] text-sm">连续打卡奖励</h3>
                  <span className="text-xs text-[#9A8B7A]">已打卡 {user.checkInStreak} 天</span>
                </div>
                <div className="flex gap-2">
                  {[7, 15, 30, 60].map((day) => (
                    <div 
                      key={day}
                      className={`flex-1 py-2 rounded-xl text-center ${
                        user.checkInStreak >= day 
                          ? 'bg-[#8FBC6B] text-white' 
                          : 'bg-[#F5F0E6] text-[#9A8B7A]'
                      }`}
                    >
                      <Gift size={16} className="mx-auto mb-1" />
                      <p className="text-[10px]">{day}天</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 打卡记录 */}
              <div className="cozy-card p-4">
                <h3 className="font-semibold text-[#5C4A3A] mb-3 text-sm">最近打卡记录</h3>
                <div className="space-y-2">
                  {checkInRecords.slice(0, 5).map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-[#F5F0E6] rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          record.type === 'sensor' ? 'bg-[#8FBC6B]' :
                          record.type === 'photo' ? 'bg-[#C4A77D]' :
                          'bg-[#7A9E6E]'
                        }`}>
                          {record.type === 'sensor' && <Sparkles size={16} className="text-white" />}
                          {record.type === 'photo' && <Camera size={16} className="text-white" />}
                          {record.type === 'daily' && <Check size={16} className="text-white" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#5C4A3A]">
                            {record.type === 'sensor' ? '传感器打卡' :
                             record.type === 'photo' ? 'AI拍照打卡' :
                             '每日签到'}
                          </p>
                          <p className="text-[10px] text-[#9A8B7A]">
                            {new Date(record.date).toLocaleString('zh-CN', { 
                              month: '2-digit', 
                              day: '2-digit', 
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#8FBC6B]">+{record.points}</span>
                    </div>
                  ))}
                  {checkInRecords.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-[#9A8B7A] text-sm">暂无打卡记录</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* 形态进化 */}
          {activeTab === 'evolution' && (
            <motion.div
              key="evolution"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* 当前状态 */}
              <div className="cozy-card p-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={teaPet.image} 
                    alt={teaPet.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[#5C4A3A]">{teaPet.name}</p>
                    <p className="text-xs text-[#9A8B7A]">Lv.{teaPet.level}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs">
                      <span className="text-[#8FBC6B]">灵气: {teaPet.aura}</span>
                      <span className="text-[#7AA857]">润泽: {teaPet.moisture}%</span>
                    </div>
                    

                  </div>
                </div>
              </div>
              
              {/* 进化路线 */}
              <div className="cozy-card p-4">
                <h3 className="font-semibold text-[#5C4A3A] mb-3 text-sm">进化路线</h3>
                <div className="space-y-3">
                  {evolutionStages.map((stage, index) => (
                    <div key={stage.stage} className="relative">
                      {index < evolutionStages.length - 1 && (
                        <div className="absolute left-5 top-12 w-0.5 h-6 bg-[#E8E2D5]" />
                      )}
                      <div className={`flex flex-col p-3 rounded-xl ${
                        stage.unlocked ? 'bg-[#8FBC6B]/10' : 'bg-[#F5F0E6]'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            stage.unlocked ? 'bg-[#8FBC6B]' : 'bg-[#9A8B7A]'
                          }`}>
                            <img 
                              src={stage.image} 
                              alt={stage.name}
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium text-sm ${stage.unlocked ? 'text-[#5C4A3A]' : 'text-[#9A8B7A]'}`}>
                              {stage.name}
                            </p>
                            <p className="text-[10px] text-[#9A8B7A]">{stage.description}</p>
                          </div>
                          {stage.unlocked ? (
                            <span className="text-xs text-[#8FBC6B] font-medium">已解锁</span>
                          ) : (
                            <span className="text-xs text-[#9A8B7A]">
                              需{stage.requiredAura}灵气
                            </span>
                          )}
                        </div>
                        
                        {/* 进化按钮 */}
                        {!stage.unlocked && teaPet.aura >= stage.requiredAura && teaPet.moisture >= stage.requiredMoisture && (
                          <motion.button
                            onClick={evolveTeaPet}
                            className="mt-3 w-full py-1.5 bg-gradient-to-r from-[#8FBC6B] to-[#7AA857] text-white rounded-lg text-xs font-medium"
                            whileTap={{ scale: 0.98 }}
                          >
                            进化
                          </motion.button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* 互动玩耍 */}
          {activeTab === 'interaction' && (
            <motion.div
              key="interaction"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* 茶宠指标展示 */}
              <div className="cozy-card p-4">
                <h3 className="font-semibold text-[#5C4A3A] mb-3 text-sm">茶宠状态</h3>
                <div className="grid grid-cols-3 gap-2">
                  {/* 灵气值 */}
                  <div className="p-3 bg-[#F5F0E6] rounded-xl text-center">
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
                  <div className="p-3 bg-[#F5F0E6] rounded-xl text-center">
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
                  <div className="p-3 bg-[#F5F0E6] rounded-xl text-center">
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
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-[#C4A77D]" />
                    <span className="text-sm text-[#5C4A3A]">当前积分: {user.points}</span>
                  </div>
                </div>
              </div>
              
              {/* 互动选项 */}
              <div className="cozy-card p-4">
                <h3 className="font-semibold text-[#5C4A3A] mb-3 text-sm">与茶宠互动</h3>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    className="p-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5]"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (deductPoints(5)) {
                        updateTeaPetStats({ intimacy: Math.min(teaPet.intimacy + 3, 100) });
                      }
                    }}
                  >
                    <Heart size={24} className="mx-auto mb-1 text-[#E8A87C]" />
                    <p className="font-medium text-[#5C4A3A] text-sm">抚摸</p>
                    <p className="text-[10px] text-[#9A8B7A]">亲密度 +3</p>
                    <p className="text-[10px] text-[#E8A87C] mt-1">-5 积分</p>
                  </motion.button>
                  
                  <motion.button
                    className="p-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5]"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (deductPoints(8)) {
                        updateTeaPetStats({ moisture: Math.min(teaPet.moisture + 5, 100) });
                      }
                    }}
                  >
                    <Droplets size={24} className="mx-auto mb-1 text-[#8FBC6B]" />
                    <p className="font-medium text-[#5C4A3A] text-sm">淋洗</p>
                    <p className="text-[10px] text-[#9A8B7A]">润泽度 +5</p>
                    <p className="text-[10px] text-[#E8A87C] mt-1">-8 积分</p>
                  </motion.button>
                  
                  <motion.button
                    className="p-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5]"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (deductPoints(10)) {
                        updateTeaPetStats({ aura: teaPet.aura + 5 });
                      }
                    }}
                  >
                    <Sparkles size={24} className="mx-auto mb-1 text-[#C4A77D]" />
                    <p className="font-medium text-[#5C4A3A] text-sm">喂食</p>
                    <p className="text-[10px] text-[#9A8B7A]">灵气值 +5</p>
                    <p className="text-[10px] text-[#E8A87C] mt-1">-10 积分</p>
                  </motion.button>
                  
                  <motion.button
                    className="p-3 bg-[#F5F0E6] rounded-xl border border-[#E8E2D5]"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (deductPoints(15)) {
                        updateTeaPetStats({
                          aura: teaPet.aura + 2,
                          moisture: Math.min(teaPet.moisture + 2, 100),
                          intimacy: Math.min(teaPet.intimacy + 2, 100)
                        });
                      }
                    }}
                  >
                    <Clock size={24} className="mx-auto mb-1 text-[#7A9E6E]" />
                    <p className="font-medium text-[#5C4A3A] text-sm">陪伴</p>
                    <p className="text-[10px] text-[#9A8B7A]">全属性 +2</p>
                    <p className="text-[10px] text-[#E8A87C] mt-1">-15 积分</p>
                  </motion.button>
                </div>
              </div>
              
              {/* 设计图展示 */}
              <div className="cozy-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#5C4A3A] text-sm">设计图</h3>
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
              </div>
              
              {/* 亲密度进度 */}
              <div className="cozy-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#5C4A3A] text-sm">亲密度等级</h3>
                  <span className="text-xs text-[#9A8B7A]">{teaPet.intimacy}/100</span>
                </div>
                <div className="h-2 bg-[#E8E2D5] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#E8A87C] to-[#D4956A] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${teaPet.intimacy}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-[10px] text-[#9A8B7A] mt-2">
                  亲密度达到100可解锁专属互动动作
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 打卡成功提示 */}
      <AnimatePresence>
        {showCheckInSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-[#8FBC6B] text-white px-6 py-4 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2">
                <Check size={24} />
                <span className="font-medium">打卡成功！</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 扫码绑定弹窗 */}
      <Dialog open={showScanModal} onOpenChange={setShowScanModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[320px] bg-[#FFFEF8] rounded-3xl p-6 border-2 border-[#E8E2D5]">
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowScanModal(false)}>
              <X size={20} className="text-[#9A8B7A]" />
            </button>
          </div>
          <AnimatePresence mode="wait">
            {scanStep === 'scan' && (
              <motion.div
                key="scan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
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
              </motion.div>
            )}
            
            {scanStep === 'binding' && (
              <motion.div
                key="binding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-48 h-48 mx-auto bg-[#F5F0E6] rounded-2xl flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <ScanLine size={64} className="text-[#8FBC6B]" />
                  </motion.div>
                </div>
                <p className="text-[#5C4A3A] font-medium mb-4">正在绑定茶宠...</p>
              </motion.div>
            )}
            
            {scanStep === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-48 h-48 mx-auto bg-[#8FBC6B]/20 rounded-2xl flex items-center justify-center mb-4">
                  <Check size={64} className="text-[#8FBC6B]" />
                </div>
                <p className="text-[#5C4A3A] font-medium mb-4">绑定成功！</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
