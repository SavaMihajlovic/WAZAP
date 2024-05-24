import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentFailureForm.css';
import { jwtDecode } from 'jwt-decode';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';

const PaymentFailureForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBackToPage = () => {
    
    setLoading(true);

    const token = localStorage.getItem('token'); 
    const decodedToken = jwtDecode(token); 
    const role = decodedToken.Type;
    let path = '';

    if(role === 'Kupac')
      path = 'kupac';
    
    setTimeout(() => {
      navigate(`/${path}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="failure-payment-container">
      <div className="failure-payment-header">
        <div className="failure-payment-text">Plaćanje nije uspelo</div>
        <div className="failure-payment-underline"></div>
      </div>
      <div className="failure-payment-buttons">
        <button className="capsule-button" onClick={handleBackToPage}>Idi nazad na stranicu</button>
      </div>
      {loading && (<div className='loading-container'> <LoadingSpinner /></div>)}
    </div>
  );
};

export default PaymentFailureForm;
