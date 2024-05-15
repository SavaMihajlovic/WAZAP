import React, { useState } from 'react';
import './ForgotPasswordForm.css';
import axios from 'axios';
import { InputEmail } from '../CheckingInputs/InputEmail/InputEmail';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ForgotPasswordForm = () => {

  const [email,setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    setLoading(true);

    try {
      await axios.post(`http://localhost:5212/Auth/ForgotPassword/${email}`);
      alert("Email poslat!");
    } catch (error) {
      console.error('Greška pri slanju emaila:', error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="forgotPassword-container">
      <div className="header">
        <div className="text">Forgot password</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
         <InputEmail setEmail={setEmail}/>
      </div>
      <div className="submit-container">
      {loading ? 
        <div className='loading-container'> <LoadingSpinner /></div>
         : <div className="submit" onClick={handleSubmit}>Send</div>}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
