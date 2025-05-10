import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import KeyIcon from "@mui/icons-material/VpnKey";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import "./SignIn.css";

export const SignIn = () => {
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
                    <h2>Create an Account</h2>
                    <div className="input-group">
                        <span className="input-icon">
                            <PersonIcon style={{ width: 25, height: 25 }} />
                        </span>
                        <input
                            type="text"
                            placeholder="Enter username..."
                            className="login-input"
                        />
                    </div>
                    <div className="input-group">
                        <span className="input-icon">
                            <EmailIcon style={{ width: 25, height: 25 }} />
                        </span>
                        <input
                            type="email"
                            placeholder="Enter email..."
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
                    <div className="input-group">
                        <span className="input-icon">
                            <KeyIcon style={{ width: 25, height: 25 }} />
                        </span>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            className="login-input"
                        />
                    </div>
                    <button className="login-button" style={{ marginTop: 32 }}>
                        Sign Up
                    </button>
                    <div className="signup-text" style={{ marginTop: 32 }}>
                        Already have an Account? <a href="#">Log in</a>
                    </div>
                </div>
            </div>
        </div>
    );
};