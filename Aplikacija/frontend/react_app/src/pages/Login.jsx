import React, { useState } from 'react'
import LoginForm from '../components/LoginForm/LoginForm'

export const Login = () => {
  const [showFooter, setShowFooter] = useState(true);

  useState(() => {
    setShowFooter(false);
  }, []);

  return (
    <div className='login-content'>
      <LoginForm />
    </div>
  );
}
