import type { ReactNode } from 'react';
import { NavBar } from './NavBar';

interface MobileLayoutProps {
  children: ReactNode;
  showNavBar?: boolean;
  navBarProps?: Parameters<typeof NavBar>[0];
  className?: string;
}

export function MobileLayout({ 
  children, 
  showNavBar = true,
  navBarProps,
  className = ''
}: MobileLayoutProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 顶部导航 */}
      {showNavBar && (
        <div className="flex-shrink-0">
          <NavBar {...navBarProps} />
        </div>
      )}
      
      {/* 主内容区 - 可滚动 */}
      <main 
        className={`flex-1 overflow-y-auto ${showNavBar ? 'pt-12' : ''} ${className}`}
      >
        {children}
      </main>
    </div>
  );
}
