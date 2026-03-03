import { ChevronLeft, Bell, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';

interface NavBarProps {
  title?: string;
  showBack?: boolean;
  showNotification?: boolean;
  showScan?: boolean;
  onBack?: () => void;
  onScan?: () => void;
  rightContent?: React.ReactNode;
}

export function NavBar({ 
  title, 
  showBack = false, 
  showNotification = false, 
  showScan = false, 
  onBack,
  onScan,
  rightContent
}: NavBarProps) {
  const { setCurrentPage } = useAppStore();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setCurrentPage('home');
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[430px] mx-auto">
        <div 
          className="px-3 py-2 flex items-center justify-between"
          style={{
            background: 'linear-gradient(180deg, rgba(245,240,230,0.95) 0%, rgba(245,240,230,0.8) 70%, rgba(245,240,230,0) 100%)'
          }}
        >
          {/* 左侧 */}
          <div className="flex items-center w-10">
            {showBack && (
              <motion.button
                onClick={handleBack}
                className="w-8 h-8 rounded-full bg-[#E8E2D5]/80 flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={18} className="text-[#5C4A3A]" />
              </motion.button>
            )}
          </div>
          
          {/* 中间标题 */}
          <div className="flex-1 text-center">
            {title && (
              <h1 className="text-base font-semibold text-[#5C4A3A]">{title}</h1>
            )}
          </div>
          
          {/* 右侧 */}
          <div className="flex items-center justify-end gap-1 w-20">
            {showScan && (
              <motion.button
                onClick={onScan}
                className="w-8 h-8 rounded-full bg-[#E8E2D5]/80 flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
              >
                <ScanLine size={16} className="text-[#5C4A3A]" />
              </motion.button>
            )}
            {showNotification && (
              <motion.button
                className="w-8 h-8 rounded-full bg-[#E8E2D5]/80 flex items-center justify-center relative"
                whileTap={{ scale: 0.9 }}
              >
                <Bell size={16} className="text-[#5C4A3A]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E8A87C] rounded-full" />
              </motion.button>
            )}
            {rightContent}
          </div>
        </div>
      </div>
    </div>
  );
}
