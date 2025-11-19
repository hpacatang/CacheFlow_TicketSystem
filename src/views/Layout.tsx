import React, { ReactNode } from 'react';
import DynamicSidebar from './components/Sidebars/DynamicSidebar';

interface LayoutProps {
  children: ReactNode;
  module?: string; // Just a label, not used for access control
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  module, 
  className = ''
}) => {
  // Layout just provides the sidebar - no access control
  // Access Control team can add their own checks if needed
  
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