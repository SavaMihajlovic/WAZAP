import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Login, Register, About, ForgotPassword, ResetPassword } from './pages';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

const App = () => {
  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`container ${theme}`}>
      <BrowserRouter>
        <Navbar theme={theme} setTheme={setTheme} />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About theme={theme} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<Navigate to="/" />} />
            <Route path="/reset-password/:email/:token" element={<ResetPassword />} />
           

            {/*Navigacije*/}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
          {/*<Footer theme={theme} />*/}
        </div>
      </BrowserRouter>
      {loading && <div className="loading-container"><LoadingSpinner /></div>}
    </div>
  );
};

export default App;