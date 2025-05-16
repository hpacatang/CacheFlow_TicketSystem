import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import './SidebarLayout.css';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') || 'user';

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    alert("logging out");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      {/* Notification Icon */}
      <div className="notif-icon">
        <button onClick={() => navigate("/notifications")}>
          <NotificationsIcon className="icon" sx={{ fontSize: '2.5rem' }} />
        </button>
      </div>

      {/* Role Section */}
      <div className="role">
        <img className="logo" src="/cacheflowlogo.png" alt="LOGO" />
       <p>{role.charAt(0).toUpperCase() + role.slice(1)}</p>

      </div>

      {/* Links Section (Children content) */}
      <div className="links">
        {children}
      </div>

      {/* Footer */}
      <div className="footer">
        <button onClick={handleLogout} className="logout">⬅ Log Out</button>
        <div className="settings-icon">
          <button onClick={() => navigate("/settings")}>
            <SettingsIcon className="icon" sx={{ fontSize: '2.5rem' }} />
          </button>
        </div>
      </div>
    </div>
  );
}