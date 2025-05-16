import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './ResetPass.css';

export const ResetPass = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleToggleShow = () => setShowPassword((show) => !show);

  return (
    <div className="forgot-password-center-container">
      <div className="forgot-password-card-simple" style={{ maxWidth: 440, width: '100%' }}>
        <h2>Confirm New Password</h2>
        <div className="input-group-simple" style={{ marginBottom: 18 }}>
          <span className="input-icon-simple">
            <LockIcon style={{ width: 22, height: 22, color: '#888' }} />
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            className="forgot-password-input-simple"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ paddingRight: 44 }}
          />
          <span
            className="input-icon-simple"
            style={{
              right: 14,
              left: 'auto',
              cursor: 'pointer',
              opacity: 1,
              color: '#888',
              width: 22,
              height: 22,
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
            onClick={handleToggleShow}
            tabIndex={0}
            role="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>
        <div className="input-group-simple">
          <span className="input-icon-simple">
            <VpnKeyIcon style={{ width: 22, height: 22, color: '#888' }} />
          </span>
          <input
            type="password"
            placeholder="Confirm password"
            className="forgot-password-input-simple"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
        </div>
        <button className="reset-button-simple" style={{ marginTop: 10 }}>Change</button>
        <div className="back-to-login-simple">
          <Link to="/login">&#8592; Back to log in</Link>
        </div>
      </div>
    </div>
  );
};
