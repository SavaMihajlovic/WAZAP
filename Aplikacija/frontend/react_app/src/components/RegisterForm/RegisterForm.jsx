import React, { useState, useEffect } from 'react';
import './RegisterForm.css';
import user_icon from '../../assets/person.png';
import { useNavigate } from 'react-router-dom';
import { InputEmail } from '../CheckingInputs/InputEmail/InputEmail';
import InputPassword from '../CheckingInputs/InputPassword/InputPassword';

const RegisterForm = () => {
  const [action, setAction] = useState('Register');
  const [userType, setUserType] = useState('Kupac');
  const [dob, setDob] = useState('');
  const [ageError, setAgeError] = useState(false);
  const navigate = useNavigate();

  
  
  const handleActionChange = (newAction) => {
    setAction(newAction);
    if (newAction === 'Login') {
      navigate('/login');
    }
  };

  const handleDateChange = (event) => {
    setDob(event.target.value);
    setAgeError(false); // poruka o gresci se resetuje kad promenimo datum
  };

  const handleSubmit = () => {
    const currentDate = new Date();
    const selectedDate = new Date(dob);
    const age = currentDate.getFullYear() - selectedDate.getFullYear();
    if (age < 18 ||
       (age === 18 && currentDate.getMonth() < selectedDate.getMonth()) ||
        (age === 18 && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getDate() < selectedDate.getDate())) {
      
      setAgeError(true);
    } 
    else
      setAgeError(false);
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
          <InputEmail />
          <InputPassword />
          <div className={`input ${ageError ? 'error' : ''}`}>
        <input type='date' value={dob} onChange={handleDateChange} placeholder='Datum rođenja'/>
        </div>
        {ageError && <div className="error-message">Morate biti stariji od 18 godina!</div>}
        <div className="radio-buttons">
          <label>
            <input type="radio" value="Kupac" checked={userType === 'Kupac'}
              onChange={() => setUserType('Kupac')}
            />
            Kupač
          </label>
          <label>
            <input type="radio" value="Radnik" checked={userType === 'Radnik'}
              onChange={() => setUserType('Radnik')}
            />
            Radnik
          </label>
        </div>
      </div>
      <div className="submit-container">
      <div className={action === "Register" ? "submit" : "submit gray"} onClick={handleSubmit}>Register</div>
        <div className={action === "Login" ? "submit gray" : "submit"} onClick={()=> handleActionChange("Login")}>Login</div>
      </div>
    </div>
  )
}

export default RegisterForm;