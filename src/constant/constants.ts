// ROUTER PATH
export const PATHS = {
  MAIN: {
    path: "/",
    label: "Not Found"
  },
  LOGIN: {
    path: "/login",
    label: "Login"
  },
  LOGOUT: {
    path: "/logout",
    label: "Logout"
  },
  DASHBOARD: {
    path: "/dashboard",
    label: "Dashboard"
  },
  DASHBOARD_USER: {
    path: "/dashboard-user",
    label: "User Dashboard"
  },
  NOT_FOUND: {
    path: "*",
    label: "Not Found"
  },
  KNOWLEDGE_BASE: { 
    path: '/knowledge-base', 
    label: 'Knowledge Base' },
  SIGN_IN: { 
    path: '/sign-in', 
    label: 'Sign In' },
  ANALYTICS: { 
    path: '/analytics', 
    label: 'Analytics' },
};

// SIDE BAR MENU PATH
export const SIDE_BAR_MENU = [
  {
    path: "/dashboard",
    label: "Dashboard"
  },
  {
    path: "/logout",
    label: "Logout"
  }
  // Add more path here
];
