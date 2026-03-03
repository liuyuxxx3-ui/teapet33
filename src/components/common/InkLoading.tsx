import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';

export function InkLoading() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F5F0E6 0%, #EDE8DC 100%)' }}
    >
      {/* 装饰元素 */}
      <div className="absolute top-10 left-10 w-16 h-16 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#8FBC6B" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-10 w-20 h-20 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#C4A77D" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      </div>
      
      {/* 青蛙图标 */}
      <motion.div
        className="relative mb-6"
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-[#8FBC6B] to-[#7A9E6E] rounded-3xl flex items-center justify-center shadow-lg">
          <Leaf size={40} className="text-white" />
        </div>
        
        {/* 装饰叶子 */}
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-[#C4A77D] rounded-full"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      
      {/* 品牌名称 */}
      <motion.h1
        className="text-2xl font-bold text-[#5C4A3A] mb-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        茗茶宠舍
      </motion.h1>
      
      <motion.p
        className="text-xs text-[#9A8B7A] mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        虚实共生 · 数字茶宠养成
      </motion.p>
      
      {/* 进度条 */}
      <div className="w-40 h-2 bg-[#E8E2D5] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #8FBC6B 0%, #7A9E6E 100%)'
          }}
          initial={{ width: 0 }}
        />
      </div>
      
      <motion.p
        className="text-[10px] text-[#9A8B7A] mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        加载中 {progress}%
      </motion.p>
    </div>
  );
}
