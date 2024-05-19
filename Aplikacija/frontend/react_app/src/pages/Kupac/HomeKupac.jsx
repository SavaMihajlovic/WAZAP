import React, {useEffect, useState} from 'react'
import Footer from '../../components/Footer/Footer'
import pool from '../../assets/pool.png';
import {jwtDecode} from 'jwt-decode';


export const HomeKupac = ({theme}) => {

  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    setUserName(decodedToken.Username);
  }, []);

  return (
    <div className="kupac-container">
        <img src={pool} alt="Pool" className="pool-img" />
        <div className='overlay'></div>
            <div className='content'>
                <h1>Welcome, {userName}</h1>
                <p>To WAZAP.</p>
        <Footer theme={theme} userType="Kupac" />
          </div>
    </div>

  )
}
