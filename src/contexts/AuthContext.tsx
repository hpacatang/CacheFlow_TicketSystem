import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

// Define user roles
export type UserRole = 'user' | 'agent' | 'admin' | 'superadmin';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Ticket Dashboard Column Visibility by Role
export interface TicketColumnVisibility {
  id: boolean;
  priority: boolean;
  summary: boolean;
  name: boolean;
  assignee: boolean;
  status: boolean;
  dueDate: boolean;
  resolvedAt: boolean;
  actions: boolean;
}

// Column visibility configuration for ticket dashboard
const TICKET_COLUMN_VISIBILITY: Record<UserRole, TicketColumnVisibility> = {
  user: {
    id: false,
    priority: true,
    summary: true,
    name: false,
    assignee: true,
    status: true,
    dueDate: false,
    resolvedAt: true,
    actions: true,
  },
  agent: {
    id: true,
    priority: true,
    summary: true,
    name: true,
    assignee: true,
    status: true,
    dueDate: true,
    resolvedAt: true,
    actions: true,
  },
  admin: {
    id: true,
    priority: true,
    summary: true,
    name: true,
    assignee: true,
    status: true,
    dueDate: true,
    resolvedAt: true,
    actions: true,
  },
  superadmin: {
    id: true,
    priority: true,
    summary: true,
    name: true,
    assignee: true,
    status: true,
    dueDate: true,
    resolvedAt: true,
    actions: true,
  },
};

// ============================================================
// AUTH CONTEXT INTERFACE
// ============================================================

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  getUserRole: () => UserRole;
  getTicketColumnVisibility: () => TicketColumnVisibility;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('username');
    const storedUserRole = localStorage.getItem('userRole') as UserRole;
    const storedUserEmail = localStorage.getItem('userEmail');

    if (storedUserId && storedUserName && storedUserRole) {
      const userData: User = {
        id: storedUserId,
        name: storedUserName,
        email: storedUserEmail || '',
        role: storedUserRole,
      };
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Store in localStorage
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('username', userData.name);
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userEmail', userData.email);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
  };

  const getUserRole = (): UserRole => {
    return user?.role || 'user';
  };

  const getTicketColumnVisibility = (): TicketColumnVisibility => {
    const role = getUserRole();
    return TICKET_COLUMN_VISIBILITY[role];
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    getUserRole,
    getTicketColumnVisibility,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};