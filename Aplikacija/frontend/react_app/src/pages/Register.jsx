import React, {useState} from 'react'
import RegisterForm from '../components/RegisterForm/RegisterForm'

export const Register = () => {
  const [showFooter, setShowFooter] = useState(true);

  useState(() => {
    setShowFooter(false);
  }, []);

  return (
    <div className='register-content'>
      <RegisterForm />
    </div>
  );
}
