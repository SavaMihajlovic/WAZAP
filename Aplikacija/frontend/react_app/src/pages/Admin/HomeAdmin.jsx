import React from 'react'
import Footer from '../../components/Footer/Footer'
import pool from '../../assets/pool.png';

export const HomeAdmin = ({theme}) => {
  return (
    <div className="admin-container">
        <img src={pool} alt="Pool" className="pool-img" />
        <div className='overlay'></div>

            <div className='content'>
                <h1>Welcome, {userName}</h1>
                <p>To WAZAP.</p>
        <Footer theme={theme} userType="Admin" />
         </div>
    </div>
  )
}
