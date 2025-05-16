import React from "react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

import "./Login.css";

export const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userRole', 'admin'); //TO CONTROL SIDEBAR ROLES

    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img
          className="background-image"
          alt="Background"
          src="/image-6.png"
        />
        <div className="login-left-content">
          <img
            className="logo-image"
            alt="Cacheflow"
            src="/cacheflowlogo.png"
          />
          <div className="welcome-text">Welcome to</div>
          <div className="brand-name">CACHE FLOW</div>
          <div className="brand-tagline">Streamlining support, one ticket at a time</div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Log in to your Account</h2>
          
          <div className="input-group">
            <span className="input-icon">
              <EmailIcon style={{ width: 25, height: 25 }} />
            </span>
            <input
              type="text"
              placeholder="Enter email or username..."
              className="login-input"
            />
          </div>

          <div className="input-group">
            <span className="input-icon">
              <LockIcon style={{ width: 25, height: 25 }} />
            </span>
            <input
              type="password"
              placeholder="Enter password..."
              className="login-input"
            />
            <span className="input-icon-right">
              <VisibilityOffIcon style={{ width: 25, height: 25 }} />
            </span>
          </div>

          <div className="forgot-password">
            <a href="/forgot-pass">forgot password?</a>
          </div>

          <button className="login-button" onClick={handleLogin}>Log In</button>

          <div className="signup-text">
            Don't have an Account? <a href="/sign-in">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};
