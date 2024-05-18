import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import pool from '../../assets/pool.png';
import {jwtDecode} from 'jwt-decode';

export const HomeRadnik = ({ theme }) => {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const redirectIfTokenExpired = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const { Username, exp } = decoded;

                setUserName(Username);

                if (exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    navigate('/');
                } 
            } catch (error) {
                console.error('Invalid token', error);
            }
        };

        redirectIfTokenExpired();
    }, [navigate]);

    return (
        <div className="radnik-container">
            <img src={pool} alt="Pool" className="pool-img" />
            <div className='overlay'></div>

            <div className='content'>
                <h1>Welcome, {userName}</h1>
                <p>To WAZAP.</p>
                <Footer theme={theme} userType="Radnik" />
            </div>
        </div>
    );
}
