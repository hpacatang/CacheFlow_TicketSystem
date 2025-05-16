import React from 'react';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import './ForgotPass.css';

const ForgotPass = () => {
  return (
    <div className="forgot-password-center-container">
      <div className="forgot-password-card-simple" style={{ maxWidth: 440, width: '100%' }}>
        <h2>Forgot Password?</h2>
        <p className="instruction-text-simple">
          Enter email and receive password change link
        </p>
        <div className="input-group-simple">
          <span className="input-icon-simple">
            <EmailIcon style={{ width: 22, height: 22, color: '#888' }} />
          </span>
          <input
            type="email"
            placeholder="Enter email..."
            className="forgot-password-input-simple"
          />
        </div>
        <button className="reset-button-simple">Submit</button>
        <div className="back-to-login-simple">
          <Link to="/login">&#8592; Back to log in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
