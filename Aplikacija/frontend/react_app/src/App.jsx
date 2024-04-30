import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Home,Login,Register,About} from './pages'
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
          </Routes>
          {/*<Footer theme={theme} />*/}
        </div>
      </BrowserRouter>
      {loading && <div className="loading-container"><LoadingSpinner /></div>}
    </div>
  );
};

export default App;