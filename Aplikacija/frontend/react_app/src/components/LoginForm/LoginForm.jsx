import React, { useState } from 'react';
import './LoginForm.css';
import axios from 'axios';
import user_icon from '../../assets/person.png';
import { useNavigate } from 'react-router-dom';
import InputPassword from '../CheckingInputs/InputPassword/InputPassword';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const LoginForm = () => {
  const [action, setAction] = useState('Login');
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [usernameError,setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showValidationError, setShowValidationError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleActionChange = (newAction) => {
    setAction(newAction);
    if (newAction === 'Register') {
      navigate('/register');
      setUsernameError(false);

    } else if (newAction === 'ForgotPassword') {
      navigate('/forgot-password');
      setPasswordError(false);
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

    if (!username.trim()) {
      setUsernameError(true);
    }
    if (!password.trim()) {
      setPasswordError(true);
    }
    if (!username.trim() || !password.trim()) {
      setShowValidationError(true);
      return; 
    } else {
      setShowValidationError(false);
    }

    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:5212/Auth/Login/${username}/${password}`);
      console.log('Uspešno:', response.data);
      localStorage.setItem('token', response.data);
      navigate('/');

    } catch (error) {
      if(error.response && error.response.status === 400) {
        setErrorMessage(error.response.data);

        if (error.response.data === 'Pogresna lozinka') {

          setPasswordError(true);
          setUsernameError(false);

        } else if (error.response.data === 'Korisnicko ime nije pronadjeno') {

          setPasswordError(false);
          setUsernameError(true);
        }

      } else {
        console.error('Greška pri prijavljivanju:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className={usernameError ? "input error" : "input"}>
          <img src={user_icon} alt=''/>
          <input type='text' name='korisnickoIme' placeholder='Username' value={username} onChange={handleInputChange}/>
        </div>
        <InputPassword setPassword={setPassword} variant='password' isEmpty={passwordError}/>
      </div>
      {showValidationError && <div className="error-message">Sva polja moraju biti popunjena!</div>}
      <div className="error-message">{errorMessage}</div>
      <div className="forgot-password">Forgot password? <span onClick={() => handleActionChange('ForgotPassword')}>Send via email!</span> </div>
      <div className="submit-container">
      {loading ? <div className='loading-container'> <LoadingSpinner /></div> :
        <div className={action === "Login" ? "submit" : "submit gray"} onClick={handleSubmit}>Login</div>}
        <div className={action === "Register" ? "submit gray" : "submit"} onClick={() => handleActionChange("Register")}>Register</div>
      </div>
    </div>
  )
}

export default LoginForm;