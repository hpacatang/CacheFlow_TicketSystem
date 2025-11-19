import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { UserSidebar } from './UserSidebar';
import { AgentSidebar } from './AgentSidebar';
import { AdminSidebar } from './AdminSidebar';

interface DynamicSidebarProps {
  className?: string;
}

export const DynamicSidebar: React.FC<DynamicSidebarProps> = ({ className }) => {
  const { getUserRole } = useAuth();
  const userRole = getUserRole();

  const renderSidebar = () => {
    switch (userRole) {
      case 'user':
        return <UserSidebar />;
      case 'agent':
        return <AgentSidebar />;
      case 'admin':
      case 'superadmin':
        return <AdminSidebar />;
      default:
        return <UserSidebar />; // Fallback to user sidebar
    }
  };

  return (
    <div className={className}>
      {renderSidebar()}
    </div>
  );
};

export default DynamicSidebar;