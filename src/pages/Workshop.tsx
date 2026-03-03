import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Wand2, RefreshCw, Save, Share2, Layers, Type, Sparkles } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAppStore } from '@/stores/appStore';
import { skins } from '@/data/user';

const materials = [
  { id: 'zisha', name: '紫砂', color: '#8B4513', description: '传统宜兴紫砂，温润如玉' },
  { id: 'ceramic', name: '陶瓷', color: '#F5F5F5', description: '白瓷质感，纯净雅致' },
  { id: 'jade', name: '玉石', color: '#00A86B', description: '翡翠质感，晶莹剔透' },
  { id: 'resin', name: '树脂', color: '#4A90E2', description: '现代材质，色彩丰富' }
];

const accessories = [
  { id: 'none', name: '无配饰', icon: null },
  { id: 'pendant', name: '挂坠', icon: Sparkles },
  { id: 'base', name: '底座', icon: Layers },
  { id: 'collar', name: '项圈', icon: Type }
];

export function Workshop() {
  const { teaPets, currentTeaPetId, saveDesign, deductPoints, updateTeaPetStats, user } = useAppStore();
  const teaPet = teaPets.find(tp => tp.id === currentTeaPetId) || teaPets[0];
  const [activeTab, setActiveTab] = useState<'custom' | 'skin' | 'ai'>('custom');
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [selectedAccessory, setSelectedAccessory] = useState(accessories[0]);
  const [customText, setCustomText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [claimedCards, setClaimedCards] = useState<string[]>(() => {
    // 从本地存储加载已领取的卡片
    const saved = localStorage.getItem('claimedCards');
    return saved ? JSON.parse(saved) : [];
  });
  
  // 切换标签页时重置生成的图片
  useEffect(() => {
    setGeneratedImage(null);
  }, [activeTab]);
  
  // AI生成
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      alert('请输入提示词');
      return;
    }
    
    // AI设计消耗300积点
    const pointsCost = 300;
    
    // 显示积点消费提醒
    const confirmed = window.confirm(`\n┌─────────────────────┐\n│ ⚠️  积点消费提醒  ⚠️ │\n├─────────────────────┤\n│ AI设计需要消耗 ${pointsCost} 积点 │\n│                     │\n│ 当前积点: ${user ? user.points : 0}     │\n│                     │\n│ 确定要生成吗？      │\n└─────────────────────┘`);
    if (!confirmed) {
      return;
    }
    
    // 扣除积点
    const success = deductPoints(pointsCost);
    if (!success) {
      window.alert('\n❌ 积点不足 ❌\n\n您的积点不足以完成此操作\n请通过打卡或其他方式获取更多积点');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // 发送初始请求，获取任务ID
      const initialResponse = await fetch('https://grsai.dakka.com.cn/v1/draw/nano-banana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-184a458513ad41c18d2b5b792a29bb1a'
        },
        body: JSON.stringify({
          model: 'nano-banana-fast',
          prompt: `${aiPrompt}，请生成一个茶宠的图片，茶宠是一种传统工艺品，通常放在茶盘上，造型可爱，寓意吉祥, 生成时保持上传图片上的茶宠的种类和姿势等其他特征, 保持80%的相似度。`,
          aspectRatio: '1:1',
          imageSize: '1K',
          webHook: '-1' // 使用轮询方式获取结果
        })
      });
      
      if (!initialResponse.ok) {
        throw new Error(`API error! status: ${initialResponse.status}`);
      }
      
      // 获取任务ID
      const initialData = await initialResponse.json();
      if (!initialData.data || !initialData.data.id) {
        throw new Error('No task ID from API');
      }
      
      const taskId = initialData.data.id;
      console.log('Task ID:', taskId);
      
      // 等待1分钟后获取结果
      await new Promise(resolve => setTimeout(resolve, 60000));
      
      // 调用获取结果的接口
      const resultResponse = await fetch('https://grsai.dakka.com.cn/v1/draw/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-184a458513ad41c18d2b5b792a29bb1a'
        },
        body: JSON.stringify({
          id: taskId
        })
      });
      
      if (!resultResponse.ok) {
        throw new Error(`API error! status: ${resultResponse.status}`);
      }
      
      // 解析结果
      const resultData = await resultResponse.json();
      if (resultData.code === 0 && resultData.data && resultData.data.results && resultData.data.results.length > 0) {
        setGeneratedImage(resultData.data.results[0].url);
      } else {
        throw new Error('No results from API');
      }
    } catch (error) {
      console.error('AI生成失败:', error);
      // 显示默认图片作为备用方案
      setGeneratedImage('/images/tea-pet-hero.png');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // 生成实体定制预览
  const handleGenerateCustom = async () => {
    // 计算积点消费
    let pointsCost = 0;
    
    // 根据材质计算积点
    switch (selectedMaterial.id) {
      case 'zisha':
        pointsCost += 100;
        break;
      case 'ceramic':
        pointsCost += 80;
        break;
      case 'jade':
        pointsCost += 150;
        break;
      case 'resin':
        pointsCost += 50;
        break;
    }
    
    // 根据配饰计算积点
    if (selectedAccessory.id !== 'none') {
      pointsCost += 50;
    }
    
    // 根据刻字计算积点
    if (customText.trim()) {
      pointsCost += 30;
    }
    
    // 显示积点消费提醒
    const confirmed = window.confirm(`\n┌─────────────────────┐\n│ ⚠️  积点消费提醒  ⚠️ │\n├─────────────────────┤\n│ 生成预览需要消耗 ${pointsCost} 积点 │\n│                     │\n│ 当前积点: ${user ? user.points : 0}     │\n│                     │\n│ 确定要生成吗？      │\n└─────────────────────┘`);
    if (!confirmed) {
      return;
    }
    
    // 扣除积点
    const success = deductPoints(pointsCost);
    if (!success) {
      window.alert('\n❌ 积点不足 ❌\n\n您的积点不足以完成此操作\n请通过打卡或其他方式获取更多积点');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // 构建提示词
      let prompt = `请根据上传茶宠的图片, 生成一张修改的图片, 要求为要保持上传图片里的茶宠的种类和姿势, 保持80%的相似度, 材质是${selectedMaterial.name}，`;
      if (selectedAccessory.id !== 'none') {
        prompt += `配有${selectedAccessory.name}, `;
      }
      if (customText.trim()) {
        prompt += `刻有"${customText}"字样, `;
      }
      prompt += `茶宠是一种传统工艺品，通常放在茶盘上，造型可爱，寓意吉祥。`;
      
      // 发送初始请求，获取任务ID
      const initialResponse = await fetch('https://grsai.dakka.com.cn/v1/draw/nano-banana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-184a458513ad41c18d2b5b792a29bb1a'
        },
        body: JSON.stringify({
          model: 'nano-banana-fast',
          prompt: prompt,
          aspectRatio: '1:1',
          imageSize: '1K',
          urls: [teaPet.image], // 添加当前图片作为参考图
          webHook: '-1' // 使用轮询方式获取结果
        })
      });
      
      if (!initialResponse.ok) {
        throw new Error(`API error! status: ${initialResponse.status}`);
      }
      
      // 获取任务ID
      const initialData = await initialResponse.json();
      if (!initialData.data || !initialData.data.id) {
        throw new Error('No task ID from API');
      }
      
      const taskId = initialData.data.id;
      console.log('Task ID:', taskId);
      
      // 等待1分钟后获取结果
      await new Promise(resolve => setTimeout(resolve, 60000));
      
      // 调用获取结果的接口
      const resultResponse = await fetch('https://grsai.dakka.com.cn/v1/draw/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-184a458513ad41c18d2b5b792a29bb1a'
        },
        body: JSON.stringify({
          id: taskId
        })
      });
      
      if (!resultResponse.ok) {
        throw new Error(`API error! status: ${resultResponse.status}`);
      }
      
      // 解析结果
      const resultData = await resultResponse.json();
      if (resultData.code === 0 && resultData.data && resultData.data.results && resultData.data.results.length > 0) {
        setGeneratedImage(resultData.data.results[0].url);
      } else {
        throw new Error('No results from API');
      }
    } catch (error) {
      console.error('AI生成失败:', error);
      // 显示默认图片作为备用方案
      setGeneratedImage('/images/tea-pet-hero.png');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // 保存设计
  const handleSaveDesign = () => {
    // 只有当不是AI设计时才保存到全局状态
    if (activeTab !== 'ai') {
      // 计算积点消费
      let pointsCost = 0;
      
      // 根据材质计算积点
      switch (selectedMaterial.id) {
        case 'zisha':
          pointsCost += 100;
          break;
        case 'ceramic':
          pointsCost += 80;
          break;
        case 'jade':
          pointsCost += 150;
          break;
        case 'resin':
          pointsCost += 50;
          break;
      }
      
      // 根据配饰计算积点
      if (selectedAccessory.id !== 'none') {
        pointsCost += 50;
      }
      
      // 根据刻字计算积点
      if (customText.trim()) {
        pointsCost += 30;
      }
      
      // 显示积点消费提醒
      const confirmed = window.confirm(`\n┌─────────────────────┐\n│ ⚠️  积点消费提醒  ⚠️ │\n├─────────────────────┤\n│ 保存设计需要消耗 ${pointsCost} 积点 │\n│                     │\n│ 当前积点: ${user ? user.points : 0}     │\n│                     │\n│ 确定要保存吗？      │\n└─────────────────────┘`);
      if (!confirmed) {
        return;
      }
      
      // 扣除积点
      const success = deductPoints(pointsCost);
      if (!success) {
        window.alert('\n❌ 积点不足 ❌\n\n您的积点不足以完成此操作\n请通过打卡或其他方式获取更多积点');
        return;
      }
      
      const design = {
        id: Date.now().toString(),
        name: `设计${Date.now()}`,
        type: activeTab,
        material: selectedMaterial.id,
        accessory: selectedAccessory.id,
        customText: customText,
        image: generatedImage || teaPet.image,
        createdAt: new Date(),
        teaPetId: teaPet.id
      };
      
      // 保存设计
      saveDesign(design);
      
      // 更新茶宠的图片，确保养成和我的页面同步显示
      if (generatedImage) {
        updateTeaPetStats({ image: generatedImage });
      }
      
      alert(`设计已保存，消耗了 ${pointsCost} 积点`);
    } else {
      // AI设计只在本地显示，不保存到全局状态
      alert('AI设计已生成，仅在当前页面显示');
    }
  };
  
  return (
    <MobileLayout
      navBarProps={{ title: 'AI定制工坊', showBack: true }}
      className="bg-[#F5F0E6]"
    >
      <div className="px-4 py-3 pb-20">
        {/* 标签切换 */}
        <div className="flex gap-2 bg-white/80 rounded-xl p-1 border border-[#E8E2D5] mb-4">
          {[
            { id: 'custom', label: '实体定制', icon: Palette },
            { id: 'skin', label: '卡片收集', icon: Layers },
            { id: 'ai', label: 'AI设计', icon: Wand2 }
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
          {/* 实体定制 */}
          {activeTab === 'custom' && (
            <motion.div
              key="custom"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* 预览区 - 移除3D旋转 */}
              <div className="cozy-card p-4">
                <div className="relative aspect-square bg-gradient-to-br from-[#F5F0E6] to-[#EDE8DC] rounded-xl overflow-hidden flex items-center justify-center">
                  <img 
                    src={generatedImage || teaPet.image} 
                    alt="预览"
                    className="w-60 h-60 object-contain drop-shadow-lg"
                    style={{ filter: `hue-rotate(${selectedMaterial.id === 'jade' ? '120deg' : '0deg'})` }}
                  />
                  
                  {/* 材质标签 */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-center">
                    <span className="px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-[#5C4A3A]">
                      {selectedMaterial.name}材质
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 材质选择 */}
              <div className="cozy-card p-3">
                <h3 className="font-semibold text-[#5C4A3A] mb-2 text-sm">选择材质</h3>
                <div className="grid grid-cols-2 gap-2">
                  {materials.map((material) => (
                    <motion.button
                      key={material.id}
                      onClick={() => setSelectedMaterial(material)}
                      className={`p-2 rounded-xl border-2 transition-colors text-left ${
                        selectedMaterial.id === material.id
                          ? 'border-[#8FBC6B] bg-[#8FBC6B]/5'
                          : 'border-[#E8E2D5] hover:border-[#8FBC6B]/50'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-lg"
                          style={{ backgroundColor: material.color }}
                        />
                        <div>
                          <p className="font-medium text-[#5C4A3A] text-xs">{material.name}</p>
                          <p className="text-[10px] text-[#9A8B7A]">{material.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* 配饰选择 */}
              <div className="cozy-card p-3">
                <h3 className="font-semibold text-[#5C4A3A] mb-2 text-sm">选择配饰</h3>
                <div className="flex gap-2">
                  {accessories.map((accessory) => {
                    const Icon = accessory.icon;
                    return (
                      <motion.button
                        key={accessory.id}
                        onClick={() => setSelectedAccessory(accessory)}
                        className={`flex-1 py-2 px-1 rounded-xl border-2 transition-colors ${
                          selectedAccessory.id === accessory.id
                            ? 'border-[#8FBC6B] bg-[#8FBC6B]/5'
                            : 'border-[#E8E2D5] hover:border-[#8FBC6B]/50'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        {Icon && <Icon size={16} className="mx-auto mb-0.5 text-[#8FBC6B]" />}
                        <p className="text-[10px] text-[#5C4A3A]">{accessory.name}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              
              {/* 刻字 */}
              <div className="cozy-card p-3">
                <h3 className="font-semibold text-[#5C4A3A] mb-2 text-sm">定制刻字</h3>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="输入刻字内容（最多8字）"
                  maxLength={8}
                  className="w-full px-3 py-2 bg-[#F5F0E6] rounded-xl text-sm border border-[#E8E2D5] focus:outline-none focus:border-[#8FBC6B]"
                />
              </div>
              
              {/* 生成按钮 */}
              <motion.button
                onClick={handleGenerateCustom}
                disabled={isGenerating}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${isGenerating ? 'bg-[#C8C1B5] text-white' : 'bg-[#8FBC6B] text-white hover:bg-[#7DA85A]'}`}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? '生成中...' : '生成预览'}
              </motion.button>
              
              {/* 操作按钮 */}
              <div className="flex gap-2">
                <motion.button
                  onClick={handleSaveDesign}
                  className="flex-1 leaf-btn text-white py-3 rounded-xl font-medium flex items-center justify-center gap-1 text-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={16} />
                  保存设计
                </motion.button>
                <motion.button
                  className="px-3 bg-white text-[#8FBC6B] rounded-xl border border-[#E8E2D5]"
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {/* 卡片收集 */}
          {activeTab === 'skin' && (
            <motion.div
              key="skin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-2">
                {skins.map((skin, index) => {
                  // 检查是否已解锁（根据灵气值或积点购买）
                  const isUnlocked = skin.unlocked || (teaPet.aura >= skin.unlockValue * 100);
                  // 检查是否已领取奖励
                  const isRewardClaimed = claimedCards.includes(skin.id);
                  
                  return (
                    <motion.div
                      key={skin.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`cozy-card overflow-hidden ${
                        isUnlocked ? '' : 'opacity-70'
                      }`}
                    >
                      <div className="aspect-square bg-[#F5F0E6] relative">
                        <img 
                          src={skin.image} 
                          alt={skin.name}
                          className="w-full h-full object-contain p-3"
                        />
                        <div className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                          skin.rarity === 'legendary' ? 'bg-purple-500 text-white' :
                          skin.rarity === 'epic' ? 'bg-orange-500 text-white' :
                          skin.rarity === 'rare' ? 'bg-blue-500 text-white' :
                          'bg-gray-400 text-white'
                        }`}>
                          {skin.rarity === 'legendary' ? '传说' :
                           skin.rarity === 'epic' ? '史诗' :
                           skin.rarity === 'rare' ? '稀有' : '普通'}
                        </div>
                      </div>
                      <div className="p-2">
                        <h4 className="font-medium text-[#5C4A3A] text-xs">{skin.name}</h4>
                        <p className="text-[10px] text-[#9A8B7A] mt-0.5">{skin.description}</p>
                        <div className="mt-1.5 flex items-center justify-between">
                          {isUnlocked ? (
                            isRewardClaimed ? (
                              <span className="text-[10px] text-[#9A8B7A]">已领取</span>
                            ) : (
                              <span className="text-[10px] text-[#8FBC6B]">已解锁</span>
                            )
                          ) : (
                            <span className="text-[10px] text-[#9A8B7A]">
                              需要灵气值: {skin.unlockValue * 100}
                            </span>
                          )}
                          <motion.button
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              isUnlocked && !isRewardClaimed
                                ? 'bg-[#8FBC6B] text-white'
                                : 'bg-[#E8E2D5] text-[#9A8B7A]'
                            }`}
                            whileTap={{ scale: 0.95 }}
                            disabled={!isUnlocked || isRewardClaimed}
                            onClick={() => {
                              if (isUnlocked && !isRewardClaimed) {
                                // 解锁卡片后获得灵气值奖励
                                updateTeaPetStats({ aura: teaPet.aura + 50 });
                                // 标记奖励已领取
                                const newClaimedCards = [...claimedCards, skin.id];
                                setClaimedCards(newClaimedCards);
                                // 保存到本地存储
                                localStorage.setItem('claimedCards', JSON.stringify(newClaimedCards));
                                // 显示奖励领取成功弹窗
                                window.alert(`\n🎉 奖励领取成功 🎉\n\n恭喜解锁卡片，获得50点灵气值奖励！\n\n当前灵气值: ${teaPet.aura + 50}`);
                              }
                            }}
                          >
                            {isUnlocked ? (
                              isRewardClaimed ? '已领取' : '领取奖励'
                            ) : (
                              '锁定'
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* 购买卡片区域 */}
              <div className="cozy-card p-3">
                <h3 className="font-semibold text-[#5C4A3A] mb-2 text-sm">购买卡片</h3>
                <div className="space-y-2">
                  <motion.button
                    className="w-full py-2 rounded-xl bg-[#8FBC6B] text-white text-sm font-medium"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const pointsCost = 200;
                      const confirmed = window.confirm(`\n┌─────────────────────┐\n│ ⚠️  积点消费提醒  ⚠️ │\n├─────────────────────┤\n│ 购买随机卡片需要消耗 ${pointsCost} 积点 │\n│                     │\n│ 当前积点: ${user ? user.points : 0}     │\n│                     │\n│ 确定要购买吗？      │\n└─────────────────────┘`);
                      if (confirmed) {
                        const success = deductPoints(pointsCost);
                        if (success) {
                          // 模拟购买成功，随机解锁一张卡片
                          window.alert('\n✅ 购买成功 ✅\n\n获得一张随机卡片！');
                          // 这里可以添加解锁卡片的逻辑
                        } else {
                          window.alert('\n❌ 积点不足 ❌\n\n您的积点不足以完成此操作\n请通过打卡或其他方式获取更多积点');
                        }
                      }
                    }}
                  >
                    购买随机卡片 (200积点)
                  </motion.button>
                  <motion.button
                    className="w-full py-2 rounded-xl bg-[#E8E2D5] text-[#5C4A3A] text-sm font-medium"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const pointsCost = 500;
                      const confirmed = window.confirm(`\n┌─────────────────────┐\n│ ⚠️  积点消费提醒  ⚠️ │\n├─────────────────────┤\n│ 购买稀有卡片需要消耗 ${pointsCost} 积点 │\n│                     │\n│ 当前积点: ${user ? user.points : 0}     │\n│                     │\n│ 确定要购买吗？      │\n└─────────────────────┘`);
                      if (confirmed) {
                        const success = deductPoints(pointsCost);
                        if (success) {
                          // 模拟购买成功，解锁一张稀有卡片
                          window.alert('\n✅ 购买成功 ✅\n\n获得一张稀有卡片！');
                          // 这里可以添加解锁卡片的逻辑
                        } else {
                          window.alert('\n❌ 积点不足 ❌\n\n您的积点不足以完成此操作\n请通过打卡或其他方式获取更多积点');
                        }
                      }
                    }}
                  >
                    购买稀有卡片 (500积点)
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* AI设计 */}
          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* 预览区 */}
              <div className="cozy-card p-4">
                <div className="aspect-square bg-gradient-to-br from-[#F5F0E6] to-[#EDE8DC] rounded-xl overflow-hidden flex items-center justify-center">
                  {isGenerating ? (
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw size={40} className="text-[#8FBC6B] mx-auto" />
                      </motion.div>
                      <p className="mt-3 text-sm text-[#9A8B7A]">AI正在生成设计...</p>
                    </div>
                  ) : generatedImage ? (
                    <motion.img 
                      src={generatedImage}
                      alt="AI生成"
                      className="w-full h-full object-contain"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    />
                  ) : (
                    <div className="text-center text-[#9A8B7A]">
                      <Wand2 size={40} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">输入关键词，让AI为您设计</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 关键词输入 */}
              <div className="cozy-card p-3">
                <h3 className="font-semibold text-[#5C4A3A] mb-2 text-sm">设计风格</h3>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {['古风', '萌系', '国潮', '禅意', '华丽', '简约'].map((style) => (
                    <motion.button
                      key={style}
                      className="px-2 py-1 bg-[#F5F0E6] rounded-full text-[10px] text-[#9A8B7A] hover:bg-[#8FBC6B]/10 hover:text-[#8FBC6B] transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      {style}
                    </motion.button>
                  ))}
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="描述您想要的茶宠形象..."
                  className="w-full h-20 px-3 py-2 bg-[#F5F0E6] rounded-xl text-sm border border-[#E8E2D5] focus:outline-none focus:border-[#8FBC6B] resize-none"
                />
              </div>
              
              {/* 生成按钮 */}
              <motion.button
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="w-full leaf-btn text-white py-3 rounded-xl font-medium flex items-center justify-center gap-1 text-sm disabled:opacity-70"
                whileTap={{ scale: 0.98 }}
              >
                <Wand2 size={16} />
                {isGenerating ? '生成中...' : '开始生成'}
              </motion.button>
              
              {/* 灵感库 */}
              <div className="cozy-card p-3">
                <h3 className="font-semibold text-[#5C4A3A] mb-2 text-sm">AI灵感库</h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {['/images/tea-pet-stage-1.png', '/images/tea-pet-stage-2.png', '/images/tea-pet-stage-3.png'].map((img, i) => (
                    <div key={i} className="aspect-square bg-[#F5F0E6] rounded-lg overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-contain p-1" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
}
