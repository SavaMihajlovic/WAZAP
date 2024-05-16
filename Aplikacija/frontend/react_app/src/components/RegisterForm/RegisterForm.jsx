import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RegisterForm.css';
import user_icon from '../../assets/person.png';
import { useNavigate } from 'react-router-dom';
import { InputEmail } from '../CheckingInputs/InputEmail/InputEmail';
import InputPassword from '../CheckingInputs/InputPassword/InputPassword';


const RegisterForm = () => {
  const [action, setAction] = useState('Register');
  const [ageError, setAgeError] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const [userData,setUserData] = useState({
    ime: '',
    prezime: '',
    email: '',
    lozinka: '',
    korisnickoIme: '',
    tipKorisnika: 'Kupac',
    datumRodjenja: '',
  });

  const [validationError, setValidationError] = useState({
    firstNameError : false,
    lastNameError : false,
    usernameError : false,
    emailError : false,
    password: false,
    dobError : false
  });

  const handleEmailChange = (value) => {
    setUserData({ ...userData, email: value });
  };

  const handlePasswordChange = (value) => {
    setUserData({ ...userData, lozinka: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target; 
    setUserData({ ...userData, [name]: value }); 
  };
  
  const handleActionChange = (newAction) => {
    setAction(newAction);
    if (newAction === 'Login') {
      navigate('/login');
    }
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
    setAgeError(false);
  };

  
  const handleSubmit = async () => {

    let errors = {
      firstNameError: !userData.ime.trim(),
      lastNameError: !userData.prezime.trim(),
      usernameError: !userData.korisnickoIme.trim(),
      emailError: !userData.email.trim(),
      passwordError: !userData.lozinka.trim(),
      dobError: !userData.datumRodjenja
    };

    setValidationError(errors);

    if (Object.values(errors).some(error => error)) {
      setShowValidationError(true);
      return; 
    } else {
      setShowValidationError(false);
    }
    const currentDate = new Date();
    const selectedDate = new Date(userData.datumRodjenja);
    const age = currentDate.getFullYear() - selectedDate.getFullYear();
    if (age < 18 ||
       (age === 18 && currentDate.getMonth() < selectedDate.getMonth()) ||
        (age === 18 && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getDate() < selectedDate.getDate())) {

      setAgeError(true);
      return;
    } 

    try {
      const response = await axios.post('http://localhost:5212/Auth/Register', userData);
      navigate('/login');
    } catch (error) {
      console.error('Greška pri registraciji:', error);

      if(error.response && error.response.status === 400) {
        setErrorMessage(error.response.data);
      }
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
      <div className={validationError.firstNameError ? "input error" : "input"}>
          <img src={user_icon} alt=''/>
          <input type='text' name='ime' placeholder='First Name' value={userData.ime} onChange={handleChange}/>
        </div>
        <div className={validationError.lastNameError ? "input error" : "input"}>
          <img src={user_icon} alt=''/>
          <input type='text' name='prezime' placeholder='Last Name' value={userData.prezime} onChange={handleChange}/>
        </div>
        <div className={validationError.usernameError ? "input error" : "input"}>
          <img src={user_icon} alt=''/>
          <input type='text' name='korisnickoIme' placeholder='Username' value={userData.korisnickoIme} onChange={handleChange}/>
        </div>
          <InputEmail setEmail={handleEmailChange} isEmpty={validationError.emailError} />
          <InputPassword setPassword={handlePasswordChange} variant='password' isEmpty={validationError.passwordError}/>
          <div className={`input ${ageError ? 'error' : ''}`}>
          <div className={`input ${validationError.dobError ? 'error' : ''}`}>
            <input type='date' name='datumRodjenja' value={userData.datumRodjenja} onChange={handleDateChange} placeholder='Datum rođenja'/>
          </div>
        </div>
        {ageError && <div className="error-message">Morate biti stariji od 18 godina!</div>}
        {showValidationError && <div className="error-message">Sva polja moraju biti popunjena!</div>}
        <div className="error-message">{errorMessage}</div>
        <div className="radio-buttons">
          <label>
            <input type="radio" checked={userData.tipKorisnika === 'Kupac'} 
            onChange={() => setUserData({ ...userData, tipKorisnika: 'Kupac' })}
            />
            Kupač
          </label>
          <label>
            <input type="radio" value="Radnik" checked={userData.tipKorisnika === 'Radnik'} 
            onChange={() => setUserData({ ...userData, tipKorisnika: 'Radnik' })} 
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