import React, { useState } from 'react';
import email_icon from '../../../assets/email.png';
import { FcOk, FcCancel } from "react-icons/fc";
import './InputEmail.css'

export const InputEmail = ({setEmail, isEmpty}) => {

    const [email, setEmailLocal] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [emailMessage, setEmailMessage] = useState('Molimo vas unesite vaš email');
  
    const handleEmailChange = (event) => {
      const newEmail = event.target.value;
      setEmailLocal(newEmail);
      setIsValidEmail(newEmail.endsWith('@gmail.com'));
      updateEmailMessage(newEmail);
      setEmail(newEmail);
    };
  
    const updateEmailMessage = (email) => {
        if (!email) {
          setEmailMessage('Molimo vas unesite vaš email');
        } else if (email.endsWith('@gmail.com')) {
          setEmailMessage('Uneti email je ispravan');
        } else {
          setEmailMessage('Email koji ste uneli nije ispravan');
        }
    };

  return (
    <>
     <div className={`input ${isEmpty ? 'error' : ''}`}>
          <img src={email_icon} alt=''/>
          <input type='text' placeholder='Email' value={email} onChange={handleEmailChange}/>
          {email && (isValidEmail ? <FcOk className="icon" /> : <FcCancel className="icon" />)}
    </div>
    <div className="email-message">{emailMessage}</div>
    </>
    )
}
