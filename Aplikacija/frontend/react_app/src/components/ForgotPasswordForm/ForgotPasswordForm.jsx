import React, { useState } from 'react';
import './ForgotPasswordForm.css';
import axios from 'axios';
import { InputEmail } from '../CheckingInputs/InputEmail/InputEmail';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ForgotPasswordForm = () => {

  const [email,setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {

    if (!email.trim()) {
      setEmailError(true);
    }

    if (!email.trim()) {
      setShowValidationError(true);
      return; 
    } else {
      setShowValidationError(false);
    }

    setLoading(true);

    try {
      await axios.post(`http://localhost:5212/Auth/ForgotPassword/${email}`);
      alert("Email poslat!");
    } catch (error) {

      console.error('Greška pri slanju emaila:', error);

      if(error.response && error.response.status === 400) {
        setErrorMessage(error.response.data);
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="forgotPassword-container">
      <div className="header">
        <div className="text">Zaboravljena lozinka</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
         <InputEmail setEmail={setEmail} isEmpty={emailError}/>
      </div>
      {showValidationError && <div className="error-message">Sva polja moraju biti popunjena!</div>}
      <div className="error-message">{errorMessage}</div>
      <div className="submit-container">
      {loading ? 
        <div className='loading-container'> <LoadingSpinner /></div>
         : <div className="submit" onClick={handleSubmit}>Pošaljite</div>}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
