import React, { useState } from 'react';
import password_icon from '../../../assets/password.png';
import { FcOk, FcCancel } from "react-icons/fc";
import './InputPassword.css';

const InputPassword = ({ setPassword, variant }) => {
    const [password, setPasswordLocal] = useState('');
    const [isStrongPassword, setIsStrongPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState(variant === 'password' ? 'Molimo vas unesite vaš password' : 'Molimo vas potvrdite vaš password');
    const [isRequestFulfilled, setIsRequestFulfilled] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPasswordLocal(newPassword);
        checkPasswordStrength(newPassword);
        setPassword(newPassword);
        setIsPasswordEmpty(newPassword === '');
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
            if(variant === 'password'){
                setPasswordMessage('Molimo vas unesite vaš password');
            } else {
                setPasswordMessage('Molimo vas potvrdite vaš password');
            }
        }       
        else
            setPasswordMessage('');
    };

    return (
        <>
            <div className="input">
                <img src={password_icon} alt='' />
                <input type='password' placeholder={variant === 'password' ? 'Password' : 'Confirm password'} value={password} onChange={handlePasswordChange} />
                {password && (isStrongPassword ? <FcOk className="icon" /> : <FcCancel className="icon" />)}
            </div>
            {password === '' ? (<div className="password-message">{passwordMessage}</div>) :
            (<div className={`password-requests ${isPasswordEmpty || isStrongPassword ? 'hidden' : ''}`}>
                Potrebno je uneti minimum 8 karaktera od kojih je 1 cifra!
            </div>)}
        </>
    );
};

export default InputPassword;
