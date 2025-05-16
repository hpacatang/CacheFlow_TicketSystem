import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './VerifyEmail.css';

export const VerifyEmail = () => {
  const [code, setCode] = useState(Array(6).fill(''));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, value: string) => {
    if (!/^[0-9a-zA-Z]?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    if (value && idx < 5) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="forgot-password-center-container">
      <div className="forgot-password-card-simple" style={{ maxWidth: 480, width: '100%' }}>
        <h2>Verify your Email Address</h2>
        <div className="verify-subtext">A verification code was sent to</div>
        <div className="verify-email">user1@gmail.com</div>
        <div className="verify-instruction">
          Check your inbox and enter the verification code below to verify your email address.
        </div>
        <div className="verify-code-inputs">
          {code.map((val, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              className="verify-code-input"
              value={val}
              onChange={e => handleChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              ref={el => { inputs.current[idx] = el; }}
              autoFocus={idx === 0}
            />
          ))}
        </div>
        <div className="verify-extra">
          <div>Did not receive a verification code?</div>
          <div className="verify-links">
            <button className="verify-link-btn" type="button">Resend Code</button>
            <span className="verify-link-sep">|</span>
            <button className="verify-link-btn" type="button">Change Email</button>
          </div>
        </div>
        <button className="reset-button-simple" style={{ marginTop: 18 }}>Verify</button>
        <div className="back-to-login-simple" style={{ marginTop: 12 }}>
          <Link to="/login">&#8592; Back to log in</Link>
        </div>
      </div>
    </div>
  );
};

