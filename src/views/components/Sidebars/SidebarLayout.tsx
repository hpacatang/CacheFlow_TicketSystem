import React from "react";
import {useNavigate} from "react-router-dom";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import './SidebarLayout.css';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  // const { role } = useUserRole();
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    // if (role === 'admin') {
    //  navigate('/admin-notifications'); 
    // } else if (role === 'user') {
    //  navigate('/user-notifications'); 
    // }
  };

  const handleSettingsClick = () => {
    // if (role === 'admin') {
    //   navigate('/admin-settings'); 
    // } else if (role === 'agemt') {
    //   navigate('/user-settings'); 
    // }
  };
   const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    alert("logging out");
    navigate("/login");
  };

  return ( 
    <div className="sidebar"> 

      <div className="notif-icon">
         <button onClick={handleNotificationClick}>
           <NotificationsIcon className="icon" sx={{ fontSize: '2.5rem'}}/>
         </button>
       
      </div>

      <div className="role">
        <img className="logo" src="/cacheflowlogo.png" alt="LOGO" />
        <p> ROLE NAME</p>
      </div>

      <div className="links">
        {children}
      </div>

      <div className="footer">
        <button onClick={handleLogout} className="logout">⬅ Log Out</button>
        <div className="settings-icon">
           <button onClick={handleSettingsClick}>
             <SettingsIcon className="icon" sx={{ fontSize: '2.5rem' }} />
           </button>
         
        </div>
      </div>

    </div>
  );
}
