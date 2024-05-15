import React, { useState } from 'react';
import './LoginForm.css';
import axios from 'axios';
import user_icon from '../../assets/person.png';
import { useNavigate } from 'react-router-dom';
import InputPassword from '../CheckingInputs/InputPassword/InputPassword';

const LoginForm = () => {
  const [action, setAction] = useState('Login');
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();

  const handleActionChange = (newAction) => {
    setAction(newAction);
    if (newAction === 'Register') {
      navigate('/register');
    } else if (newAction === 'ForgotPassword') {
      navigate('/forgot-password');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'korisnickoIme') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:5212/Auth/Login/${username}/${password}`);
      console.log('Uspešno:', response.data);
      localStorage.setItem('token', response.data);
      navigate('/');

    } catch (error) {
      console.error('Greška pri prijavljivanju:', error);
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
          <input type='text' name='korisnickoIme' placeholder='Username' value={username} onChange={handleInputChange}/>
        </div>
        <InputPassword setPassword={setPassword} variant='password'/>
      </div>
      <div className="forgot-password">Forgot password? <span onClick={() => handleActionChange('ForgotPassword')}>Send via email!</span> </div>
      <div className="submit-container">
        <div className={action === "Login" ? "submit" : "submit gray"} onClick={handleSubmit}>Login</div>
        <div className={action === "Register" ? "submit gray" : "submit"} onClick={() => handleActionChange("Register")}>Register</div>
      </div>
    </div>
  )
}

export default LoginForm;