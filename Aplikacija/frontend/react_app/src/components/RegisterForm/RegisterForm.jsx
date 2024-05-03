import React, { useState, useEffect } from 'react';
import './RegisterForm.css';
import user_icon from '../../assets/person.png';
import email_icon from '../../assets/email.png';
import password_icon from '../../assets/password.png';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [action, setAction] = useState('Register');
  const [userType, setUserType] = useState('Swimmer');
  const navigate = useNavigate();
  
  const handleActionChange = (newAction) => {
    setAction(newAction);
    if (newAction === 'Login') {
      navigate('/login');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="register-container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
      <div className="input">
          <img src={user_icon} alt=''/>
          <input type='text' placeholder='First Name'/>
        </div>
        <div className="input">
          <img src={user_icon} alt=''/>
          <input type='text' placeholder='Last Name'/>
        </div>
        <div className="input">
          <img src={user_icon} alt=''/>
          <input type='text' placeholder='Username'/>
        </div>
        <div className="input">
          <img src={email_icon} alt=''/>
          <input type='email' placeholder='Email'/>
        </div>
        <div className="input">
          <img src={password_icon} alt=''/>
          <input type='password' placeholder='Password'/>
        </div>
        <div className="radio-buttons">
          <label>
            <input
              type="radio"
              value="Swimmer"
              checked={userType === 'Swimmer'}
              onChange={() => setUserType('Swimmer')}
            />
            Swimmer
          </label>
          <label>
            <input
              type="radio"
              value="Seasonal Worker"
              checked={userType === 'Seasonal Worker'}
              onChange={() => setUserType('Seasonal Worker')}
            />
            Seasonal Worker
          </label>
        </div>
      </div>
      <div className="submit-container">
        <div className={action === "Register" ? "submit" : "submit gray"} onClick={()=> handleActionChange("Register")}>Register</div>
        <div className={action === "Login" ? "submit gray" : "submit"} onClick={()=> handleActionChange("Login")}>Login</div>
      </div>
    </div>
  )
}

export default RegisterForm;