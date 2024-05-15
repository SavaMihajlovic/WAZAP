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
  const [error, setError] = useState('');
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

    setLoading(true);
    setError('');

    try {
      if(password === confirmPassword) {
        await axios.post(`http://localhost:5212/Auth/ChangePassword/${email}/${password}/${token}/${confirmPassword}`);
        setSuccess(true);
        navigate('/login');
      }
    } catch (error) {
      console.error('Greška prilikom promene lozinke:', error);
      setError('Došlo je do greške prilikom promene lozinke');
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
        <InputPassword setPassword={setPassword} variant="password"/>
        <InputPassword setPassword={setConfirmPassword} variant="confirmPassword"/>
        {confirmPassword && (
          <div className={`reset-password-match ${password === confirmPassword ? 'match' : 'mismatch'}`}>
            {password === confirmPassword ? 'Lozinke se poklapaju' : 'Lozinke se ne poklapaju'}
          </div>
        )}
      </div>

      <div className="reset-submit-container">
        <div className="reset-submit" onClick={handleSubmit}>Resetuj lozinku</div>
      </div>
      {loading && (<div className='loading-container'> <LoadingSpinner /></div>)}
    </div>
  );
};

export default ResetPasswordForm;
