import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import KeyIcon from "@mui/icons-material/VpnKey";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

import "./SignIn.css";

export const SignIn = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidPassword = (password: string) => {
        return password.length >= 3;
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!username || !email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!isValidPassword(password)) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Check if username or email already exists
            const response = await fetch('http://localhost:3001/users');
            const users = await response.json();
            
            if (users.some((u: any) => u.name === username)) {
                setError("Username already exists");
                setIsLoading(false);
                return;
            }
            
            if (users.some((u: any) => u.email === email)) {
                setError("Email already exists");
                setIsLoading(false);
                return;
            }
            
            // Generate a random ID (similar to the existing IDs in db.json)
            const generateId = () => {
                return Math.floor(Math.random() * 10000).toString();
            };
            
            // Create new user
            const newUser = {
                name: username,
                email: email,
                password: password, 
                role: "user", // Default role for new registrations
                id: generateId(),
                status: "Active"
            };
            
            // Add user to db.json
            const createResponse = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
            
            if (createResponse.ok) {
                // Registration successful
                navigate("/login");
            } else {
                setError("Registration failed. Please try again.");
            }
        } catch (err) {
            console.error("Registration error:", err);
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
                    <h2>Create an Account</h2>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <form onSubmit={handleSignUp}>
                        <div className="input-group">
                            <span className="input-icon">
                                <PersonIcon style={{ width: 25, height: 25 }} />
                            </span>
                            <input
                                type="text"
                                placeholder="Enter username..."
                                className="login-input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        <div className="input-group">
                            <span className="input-icon">
                                <KeyIcon style={{ width: 25, height: 25 }} />
                            </span>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className="login-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button 
                            className="login-button" 
                            type="submit"
                            style={{ marginTop: 32 }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating Account..." : "Sign Up"}
                        </button>
                    </form>
                    <div className="signup-text" style={{ marginTop: 32 }}>
                        Already have an Account? <a href="/login">Log in</a>
                    </div>
                </div>
            </div>
        </div>
    );
};