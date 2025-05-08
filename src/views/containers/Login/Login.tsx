import { Link } from "react-router";
import { PATHS } from "../../../constant";
import { Button } from "../../components/AuthButtons/Button";
import './login.css'
import mail from "../../../assets/images/mail.png";
import lock from "../../../assets/images/lock.png";
import { Brand } from '../../components/AuthBrand/brand';

export const Login = () => {
  const handleLogin = () => {
    alert("Login button clicked!");
  };


  return (
    <div id="login-page">

    <Brand></Brand>

      <div className="form-section">

        <div className="mini-form">
          <h1>Log into your Account</h1>
          
            <div className="form">

              <div className="input-container">
                <input type="text" placeholder="Enter email or username..." />
                <img src={mail} alt="EMAIL" className="icon"/>
              </div>
              <div className="input-container">
                <input type="password" placeholder="Enter password..." />
                <img src={lock} alt="LOCK" className="icon"/>
              </div>

            </div>

              <div className="forgot-password">
                <Link to={PATHS.FORGOT.path}>Forgot password?</Link>
            </div>

            <div className="form-actions">
                <Button text="Log in" onClick={handleLogin} className="login-btn" />
                <p>Don't have an Account? 
                <Link to={PATHS.NOT_FOUND.path}> Sign Up</Link>
                </p>
            </div>
          </div>
        </div>  

  </div>

    
   
  );
};
