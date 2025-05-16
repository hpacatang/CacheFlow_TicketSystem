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
  NOT_FOUND: {
    path: "*",
    label: "Not Found"
  },
  KNOWLEDGE_BASE: { 
    path: '/knowledge-base', 
    label: 'Knowledge Base' },
  KNOWLEDGE_BASE_USER: {
    path: '/knowledge-base-user',
    label: 'Knowledge Base User' },
  SIGN_IN: { 
    path: '/sign-in', 
    label: 'Sign In' },
  ANALYTICS: { 
    path: '/analytics', 
    label: 'Analytics' },
  FORGOT_PASSWORD: { 
    path: '/forgot-pass', 
    label: 'Forgot Password' },
  CONFIRM_PASSWORD: { 
    path: '/confirm-pass', 
    label: 'Confirm Password' },
  VERIFY_EMAIL: { 
    path: '/verify-email', 
    label: 'Verify Email' },
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
