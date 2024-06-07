import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import pool from '../../assets/pool.png';
import {jwtDecode} from 'jwt-decode';

export const HomeRadnik = ({ theme }) => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.Username);
      }, []);

    return (
        <div className="radnik-container">
            <img src={pool} alt="Pool" className="pool-img" />
            <div className='overlay'></div>

            <div className='content'>
                <h1>{userName} , dobrodošli</h1>
                <p>na WAZAP.</p>
                <Footer theme={theme} userType="Radnik" />
            </div>
        </div>
    );
}
