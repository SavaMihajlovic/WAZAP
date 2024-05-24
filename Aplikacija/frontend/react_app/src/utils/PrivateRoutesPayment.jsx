import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const PrivateRoutesPayment = ({ role }) => {
  const navigate = useNavigate();

  const isPaymentRole = role === 'Payment';

  if (isPaymentRole) {
    return <Outlet />;
  } else {
    
    navigate('/');
    return null;
  }
};

export default PrivateRoutesPayment;