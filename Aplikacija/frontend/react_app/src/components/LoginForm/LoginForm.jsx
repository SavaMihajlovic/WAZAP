import React, { useState } from 'react';
import './LoginForm.css';
import user_icon from '../../assets/person.png';
import password_icon from '../../assets/password.png';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [action, setAction] = useState('Login');
  const navigate = useNavigate();

  const handleActionChange = (newAction) => {
    setAction(newAction);
    if (newAction === 'Register') {
      navigate('/register');
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={user_icon} alt=''/>
          <input type='text' placeholder='Username'/>
        </div>
        <div className="input">
          <img src={password_icon} alt=''/>
          <input type='password' placeholder='Password'/>
        </div>
      </div>
      <div className="forgot-password">Forgot password? <span>Send via email!</span> </div>
      <div className="submit-container">
        <div className={action === "Login" ? "submit" : "submit gray"} onClick={()=> handleActionChange("Register")}>Register</div>
        <div className={action === "Register" ? "submit gray" : "submit"} onClick={()=> handleActionChange("Login")}>Login</div>
      </div>
    </div>
  )
}

export default LoginForm;