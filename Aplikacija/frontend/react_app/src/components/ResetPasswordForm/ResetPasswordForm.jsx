import React, { useState, useEffect } from 'react';
import './ResetPasswordForm.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import InputPassword from '../CheckingInputs/InputPassword/InputPassword';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ResetPasswordForm = () => {
  const { email, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        await axios.post(`http://localhost:5212/Auth/ResetPassword/${email}/${token}`);
        setLoading(false);
      } catch (error) {
        console.error('Greška prilikom validacije tokena:', error);
        navigate('/');
      }
    };

    validateToken();
  }, [email, token, navigate]);

  const handleSubmit = async () => {

    if(!password.trim()) {
      setPasswordError(true);
    }
    if(!confirmPassword.trim()){
      setConfirmPasswordError(true);
    }

    if(!password.trim() || !confirmPassword.trim()) {
      setShowValidationError(true);
      return;
    } else {
      setShowValidationError(false);
    }

    setLoading(true);

    try {
      if(password === confirmPassword) {
        await axios.post(`http://localhost:5212/Auth/ChangePassword/${email}/${password}/${token}/${confirmPassword}`);
        navigate('/login');
      }
    } catch (error) {
      console.error('Greška prilikom promene lozinke:', error);
      if(error.response && error.response.status === 400) {
        setErrorMessage(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="reset-password-container">
      <div className="reset-header">
        <div className="reset-header-text">Reset Password</div>
        <div className="reset-underline"></div>
      </div>
      <div className="reset-inputs">
        <InputPassword setPassword={setPassword} variant="password" isEmpty={passwordError}/>
        <InputPassword setPassword={setConfirmPassword} variant="confirmPassword" isEmpty={confirmPasswordError}/>
        {confirmPassword && (
          <div className={`reset-password-match ${password === confirmPassword ? 'match' : 'mismatch'}`}>
            {password === confirmPassword ? 'Lozinke se poklapaju' : 'Lozinke se ne poklapaju'}
          </div>
        )}
      </div>
      {showValidationError && <div className="error-message">Sva polja moraju biti popunjena!</div>}
      <div className="error-message">{errorMessage}</div>
      <div className="reset-submit-container">
        <div className="reset-submit" onClick={handleSubmit}>Resetuj lozinku</div>
      </div>
      {loading && (<div className='loading-container'> <LoadingSpinner /></div>)}
    </div>
  );
};

export default ResetPasswordForm;
