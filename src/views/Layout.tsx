import React, { ReactNode } from 'react';
import DynamicSidebar from './components/Sidebars/DynamicSidebar';

interface LayoutProps {
  children: ReactNode;
  module?: string;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  module, 
  className = ''
}) => {
  return (
    <div className={`layout-container ${className}`} style={{ display: 'flex', minHeight: '100vh' }}>
      <DynamicSidebar />
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;