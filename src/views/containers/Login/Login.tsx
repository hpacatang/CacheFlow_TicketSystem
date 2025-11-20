import React, { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import "./Login.css";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      // POST credentials to backend (ideally /api/auth/login, fallback: fetch users and check)
      const response = await fetch("https://localhost:51811/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const users = await response.json();
      // Backend does not expose password, so you need a login endpoint. If not available, fallback:
      const user = users.find(
        (u: any) => (u.name === username || u.email === username) && u.status === "Active"
      );
      // You cannot check password here unless backend exposes it (not recommended).
      // Ideally, you should POST to /api/auth/login with { username, password }
      // For now, show error if not found
      if (user) {
        // Ensure role is valid for columnVisibility
        const validRoles = ["user", "agent", "admin", "superadmin"];
        let role = (user.role || "user").toLowerCase();
        if (!validRoles.includes(role)) role = "user";
        login({
          id: user.id?.toString() || user.userId,
          name: user.name,
          email: user.email,
          role: role,
        });
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <span className="input-icon">
                <EmailIcon style={{ width: 25, height: 25 }} />
              </span>
              <input
                type="text"
                placeholder="Enter email or username..."
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <span className="input-icon">
                <LockIcon style={{ width: 25, height: 25 }} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password..."
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span 
                className="input-icon-right" 
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? 
                  <VisibilityIcon style={{ width: 25, height: 25 }} /> : 
                  <VisibilityOffIcon style={{ width: 25, height: 25 }} />
                }
              </span>
            </div>

            <div className="forgot-password">
              <a href="/forgot-pass">forgot password?</a>
            </div>

            <button 
              className="login-button" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="signup-text">
            Don't have an Account? <a href="/sign-in">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};
