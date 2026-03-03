import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Users, Zap, Shield, Wallet, ScanLine, X, Check } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAppStore } from '@/stores/appStore';
import { mockBattles, getLeaderboard } from '@/data/user';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

export function Battle() {
  const { teaPets, currentTeaPetId, user, addPoints, updateTeaPetStats, saveBattleRecord, battleRecords } = useAppStore();
  
  // 获取当前选中的茶宠
  const teaPet = teaPets.find(tp => tp.id === currentTeaPetId) || teaPets[0];
  const [activeTab, setActiveTab] = useState<'battle' | 'rank' | 'record'>('battle');
  const [isBattling, setIsBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null);
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [opponentName, setOpponentName] = useState('随机对手');
  
  // 随机生成对手名字
  const generateOpponentName = () => {
    const prefixes = ['茶仙', '茶艺', '茶圣', '茶神', '茶翁', '茶客', '茶童', '茶师'];
    const suffixes = ['行者', '居士', '大师', '真人', '仙人', '雅士', '君子', '达人'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return prefix + suffix;
  };
  
  // 扫描状态
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
  
  // 计算战力
  const calculatePower = (aura: number, moisture: number, intimacy: number, level: number) => {
    return Math.floor(aura * 0.5 + moisture * 3 + intimacy * 2 + level * 10);
  };
  
  const myPower = calculatePower(teaPet.aura, teaPet.moisture, teaPet.intimacy, teaPet.level);
  
  // 模拟对战
  const startBattle = () => {
    setIsBattling(true);
    setBattleResult(null);
    const newOpponentName = generateOpponentName();
    setOpponentName(newOpponentName);
    setShowBattleModal(true);
    
    setTimeout(() => {
      const result = Math.random() > 0.4 ? 'win' : 'lose';
      const myScore = calculatePower(teaPet.aura, teaPet.moisture, teaPet.intimacy, teaPet.level);
      const opponentScore = result === 'win' 
        ? Math.floor(myScore * (0.7 + Math.random() * 0.2)) 
        : Math.floor(myScore * (1.1 + Math.random() * 0.2));
      
      if (result === 'win') {
        addPoints(50); // 胜利获得50积分
        // 胜利增加茶宠属性
        updateTeaPetStats({
          aura: teaPet.aura + 30,
          moisture: Math.min(teaPet.moisture + 5, 100),
          intimacy: Math.min(teaPet.intimacy + 10, 100)
        });
      }
      if (result === 'lose') {
        addPoints(-50);
        // 失败减少茶宠属性
        updateTeaPetStats({
          aura: Math.max(teaPet.aura - 10, 0),
          moisture: Math.max(teaPet.moisture - 5, 0),
          intimacy: Math.max(teaPet.intimacy - 5, 0)
        });
      }
      
      // 保存对战记录
      const battleRecord = {
        id: Date.now().toString(),
        opponent: {
          id: Math.random().toString(),
          nickname: newOpponentName,
          avatar: '',
          points: 0,
          level: 0,
          following: 0,
          followers: 0,
          checkInStreak: 0
        },
        result: result as 'win' | 'lose' | 'draw',
        myScore,
        opponentScore,
        date: new Date()
      };
      saveBattleRecord(battleRecord);
      
      setBattleResult(result);
      setIsBattling(false);
      setShowBattleModal(false);
    }, 2000);
  };
  
  const leaderboard = getLeaderboard();
  
  return (
    <MobileLayout
      navBarProps={{ 
        title: '斗茶乐园', 
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
            { id: 'battle', label: '开始对战', icon: Swords },
            { id: 'rank', label: '排行榜', icon: Trophy },
            { id: 'record', label: '对战记录', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-lg text-[10px] font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-[#8FBC6B] text-white' 
                    : 'text-[#9A8B7A] hover:text-[#5C4A3A]'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={12} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
        
        {/* 内容区 */}
        <AnimatePresence mode="wait">
          {/* 对战界面 */}
          {activeTab === 'battle' && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* 战力对比 */}
              <div className="cozy-card p-4">
                <div className="flex items-center justify-between">
                  {/* 我方 */}
                  <div className="text-center flex-1">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#8FBC6B] to-[#7A9E6E] p-0.5">
                      <img 
                        src={teaPet.image} 
                        alt={teaPet.name}
                        className="w-full h-full object-contain rounded-full bg-white"
                      />
                    </div>
                    <p className="mt-1.5 font-medium text-[#5C4A3A] text-sm">{teaPet.name}</p>
                    <p className="text-[10px] text-[#9A8B7A]">Lv.{teaPet.level}</p>
                    <div className="mt-1 inline-flex items-center gap-0.5 bg-[#8FBC6B]/10 px-2 py-0.5 rounded-full">
                      <Zap size={12} className="text-[#C4A77D]" />
                      <span className="text-xs font-bold text-[#8FBC6B]">{myPower}</span>
                    </div>
                    {/* 积分显示 */}
                    <div className="mt-2 inline-flex items-center gap-0.5 bg-[#C4A77D]/10 px-2 py-0.5 rounded-full">
                      <Wallet size={12} className="text-[#C4A77D]" />
                      <span className="text-xs font-bold text-[#C4A77D]">{user.points}</span>
                    </div>
                  </div>
                  
                  {/* VS */}
                  <div className="px-3">
                    <motion.div
                      animate={isBattling ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: isBattling ? Infinity : 0 }}
                      className="w-12 h-12 bg-gradient-to-br from-[#C4A77D] to-[#8FBC6B] rounded-full flex items-center justify-center"
                    >
                      <span className="text-white font-bold text-lg">VS</span>
                    </motion.div>
                  </div>
                  
                  {/* 对手 */}
                  <div className="text-center flex-1">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#9A8B7A] to-[#7A6A5A] p-0.5">
                      <div className="w-full h-full rounded-full bg-[#F5F0E6] flex items-center justify-center">
                        <Users size={24} className="text-[#9A8B7A]" />
                      </div>
                    </div>
                    <p className="mt-1.5 font-medium text-[#5C4A3A] text-sm">{opponentName}</p>
                    <p className="text-[10px] text-[#9A8B7A]">Lv.{Math.floor(Math.random() * 20) + 1}</p>
                    <div className="mt-1 inline-flex items-center gap-0.5 bg-[#9A8B7A]/10 px-2 py-0.5 rounded-full">
                      <Zap size={12} className="text-[#9A8B7A]" />
                      <span className="text-xs font-bold text-[#9A8B7A]">???</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 开始对战按钮 */}
              <motion.button
                onClick={startBattle}
                disabled={isBattling}
                className="w-full leaf-btn text-white py-3 rounded-2xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-70"
                whileTap={{ scale: 0.98 }}
              >
                <Swords size={20} />
                {isBattling ? '对战中...' : '开始斗茶'}
              </motion.button>
              
              {/* 对战结果 */}
              <AnimatePresence>
                {battleResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`rounded-2xl p-4 text-center ${
                      battleResult === 'win' 
                        ? 'bg-gradient-to-br from-[#8FBC6B] to-[#7A9E6E]' 
                        : 'bg-gradient-to-br from-[#9A8B7A] to-[#7A6A5A]'
                    }`}
                  >
                    <Trophy size={36} className="mx-auto text-white mb-2" />
                    <h3 className="text-xl font-bold text-white">
                      {battleResult === 'win' ? '胜利！' : '失败'}
                    </h3>
                    <p className="text-white/80 mt-1 text-sm">
                      {battleResult === 'win' 
                        ? '恭喜获得胜利！积分 +50' 
                        : '再接再厉，下次一定能赢！'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* 对战说明 */}
              <div className="cozy-card p-3">
                <h3 className="font-semibold text-[#5C4A3A] mb-2 text-sm">对战规则</h3>
                <ul className="space-y-1.5 text-xs text-[#9A8B7A]">
                  <li className="flex items-start gap-1.5">
                    <span className="w-4 h-4 bg-[#8FBC6B]/10 rounded-full flex items-center justify-center text-[10px] text-[#8FBC6B] flex-shrink-0">1</span>
                    <span>战力由灵气值、润泽度、亲密度和等级综合计算</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="w-4 h-4 bg-[#8FBC6B]/10 rounded-full flex items-center justify-center text-[10px] text-[#8FBC6B] flex-shrink-0">2</span>
                    <span>胜利可获得积分奖励，失败扣除积分</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="w-4 h-4 bg-[#8FBC6B]/10 rounded-full flex items-center justify-center text-[10px] text-[#8FBC6B] flex-shrink-0">3</span>
                    <span>每周根据排行榜发放额外奖励</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
          
          {/* 排行榜 */}
          {activeTab === 'rank' && (
            <motion.div
              key="rank"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              {leaderboard.map((item, index) => (
                <motion.div
                  key={item.user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    item.user.id === user.id 
                      ? 'bg-[#8FBC6B]/10 border border-[#8FBC6B]/30' 
                      : 'cozy-card'
                  }`}
                >
                  {/* 排名 */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    item.rank === 1 ? 'bg-yellow-400 text-white' :
                    item.rank === 2 ? 'bg-gray-400 text-white' :
                    item.rank === 3 ? 'bg-orange-400 text-white' :
                    'bg-[#F5F0E6] text-[#9A8B7A]'
                  }`}>
                    {item.rank}
                  </div>
                  
                  {/* 头像 */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8FBC6B] to-[#7A9E6E] flex items-center justify-center text-white font-bold text-sm">
                    {item.user.nickname.charAt(0)}
                  </div>
                  
                  {/* 信息 */}
                  <div className="flex-1">
                    <p className="font-medium text-[#5C4A3A] text-sm">{item.user.nickname}</p>
                    <p className="text-[10px] text-[#9A8B7A]">Lv.{item.user.level}</p>
                  </div>
                  
                  {/* 战力 */}
                  <div className="flex items-center gap-0.5">
                    <Zap size={14} className="text-[#C4A77D]" />
                    <span className="font-bold text-[#8FBC6B]">{item.score}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* 对战记录 */}
          {activeTab === 'record' && (
            <motion.div
              key="record"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              {(battleRecords.length > 0 ? battleRecords : mockBattles).map((battle) => (
                <motion.div
                  key={battle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="cozy-card p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        battle.result === 'win' ? 'bg-[#8FBC6B]' : 'bg-[#9A8B7A]'
                      }`}>
                        <Swords size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-[#5C4A3A] text-sm">
                          vs {battle.opponent.nickname}
                        </p>
                        <p className="text-[10px] text-[#9A8B7A]">
                          {new Date(battle.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold ${
                        battle.result === 'win' ? 'text-[#8FBC6B]' : 'text-[#9A8B7A]'
                      }`}>
                        {battle.result === 'win' ? '胜利' : '失败'}
                      </span>
                      <p className="text-[10px] text-[#9A8B7A]">
                        {battle.myScore} : {battle.opponentScore}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
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
      
      {/* 战斗动画弹窗 */}
      <Dialog open={showBattleModal} onOpenChange={setShowBattleModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[320px] bg-[#FFFEF8] rounded-3xl p-0 border-2 border-[#E8E2D5] overflow-hidden">
          <div className="h-64 flex items-center justify-center relative">
            {/* 背景效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C4A77D]/10 to-[#8FBC6B]/10">
              {/* 动态粒子 */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-[#8FBC6B]/50 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
            
            {/* 战斗动画 */}
            <div className="flex items-center justify-center gap-8 relative">
              {/* 我方茶宠 */}
              <motion.div
                className="relative"
                animate={{
                  x: [0, -10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8FBC6B] to-[#7A9E6E] p-1">
                  <img 
                    src={teaPet.image} 
                    alt={teaPet.name}
                    className="w-full h-full object-contain rounded-full bg-white"
                  />
                </div>
                {/* 攻击效果 */}
                <motion.div
                  className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-[#8FBC6B]/30 rounded-full"
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                />
              </motion.div>
              
              {/* VS */}
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-[#C4A77D] to-[#8FBC6B] rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <span className="text-white font-bold text-xl">VS</span>
              </motion.div>
              
              {/* 对手茶宠 */}
              <motion.div
                className="relative"
                animate={{
                  x: [0, 10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#9A8B7A] to-[#7A6A5A] p-1">
                  <div className="w-full h-full rounded-full bg-[#F5F0E6] flex items-center justify-center">
                    <Users size={32} className="text-[#9A8B7A]" />
                  </div>
                </div>
                <div className="text-center mt-2">
                  <p className="text-xs font-medium text-[#5C4A3A]">{opponentName}</p>
                </div>
                {/* 攻击效果 */}
                <motion.div
                  className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-[#9A8B7A]/30 rounded-full"
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                />
              </motion.div>
            </div>
          </div>
          
          <div className="p-4 text-center">
            <h3 className="font-bold text-[#5C4A3A] mb-2">战斗中...</h3>
            <p className="text-xs text-[#9A8B7A]">精彩战斗正在进行，请稍候</p>
            
            {/* 进度条 */}
            <div className="mt-4 h-2 bg-[#E8E2D5] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C4A77D] to-[#8FBC6B] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
