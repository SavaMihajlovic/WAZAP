import React, { useState } from 'react';
import password_icon from '../../../assets/password.png';
import { FcOk, FcCancel } from "react-icons/fc";
import './InputPassword.css';

const InputPassword = () => {
    const [password, setPassword] = useState('');
    const [isStrongPassword, setIsStrongPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('Molimo vas unesite vaš password');
    const [isRequestFulfilled, setIsRequestFulfilled] = useState(false);

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        checkPasswordStrength(newPassword);
    };

    const checkPasswordStrength = (password) => {
        const passwordLength = password.length;
        const containsNumber = /\d/.test(password);
        const isFulfilled = passwordLength >= 8 && containsNumber;
        setIsStrongPassword(isFulfilled);
        setIsRequestFulfilled(isFulfilled);
        updatePasswordMessage(password);
    };

    const updatePasswordMessage = (password) => {
        if (!password) {
            setPasswordMessage('Molimo vas unesite vaš password');
        } else if (isStrongPassword) {
            setPasswordMessage('Uneti password je jak');
        } else {
            setPasswordMessage('Password koji ste uneli nije dovoljno jak');
        }
    };

    return (
        <>
            <div className="input">
                <img src={password_icon} alt='' />
                <input type='password' placeholder='Password' value={password} onChange={handlePasswordChange} />
                {password && (isStrongPassword ? <FcOk className="icon" /> : <FcCancel className="icon" />)}
            </div>
            <div className="password-message">{passwordMessage}</div>
            <div className={`password-requests ${isRequestFulfilled ? 'fulfilled' : ''}`}>
                Potrebno je uneti minimum 8 karaktera od kojih je 1 cifra!
            </div>
        </>
    );
};

export default InputPassword;
