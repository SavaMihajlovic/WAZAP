import React, { useState } from 'react';
import './ForgotPasswordForm.css';
import { InputEmail } from '../CheckingInputs/InputEmail/InputEmail';

const ForgotPasswordForm = () => {

  const handleSubmit = () => {
    console.log("Email poslat!");
  };

  return (
    <div className="forgotPassword-container">
      <div className="header">
        <div className="text">Reset password</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
         <InputEmail/>
      </div>
      <div className="submit-container">
        <div className="submit" onClick={handleSubmit}>Send</div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
