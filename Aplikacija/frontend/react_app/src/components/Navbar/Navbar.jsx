import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo_light from '../../assets/logo-black.png';
import logo_dark from '../../assets/logo-white.png';
import toggle_light from '../../assets/night.png';
import toggle_dark from '../../assets/day.png';
import { Link, useLocation } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';

const Navbar = ({ theme, setTheme }) => {
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const location = useLocation();
  const [role, setRole] = useState('');

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.startsWith('/kupac') || pathname.startsWith('/payment')) {
      setRole('Kupac');
    } else if (pathname.startsWith('/radnik')) {
      setRole('Radnik');
    } else if (pathname.startsWith('/administrator')) {
      setRole('Admin');
    } else {
      setRole('');
    }
  }, [location]);

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const toggleBurgerMenu = () => {
    setBurgerMenuOpen(!burgerMenuOpen);
  };

  const toggle_mode = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  const closeBurgerMenu = () => {
    setBurgerMenuOpen(false);
  };

  const getMenuItems = () => {
    switch (role) {
      case 'Kupac':
        return (
          <>
            <li><Link to="/kupac" onClick={closeBurgerMenu}>Home</Link></li>
            <li><Link to="/kupac-kupovina-karata" onClick={closeBurgerMenu}>Kupovina Karata</Link></li>
            <li><Link to="/kupac-rezervisanje-lezaljki" onClick={closeBurgerMenu}>Rezervisanje ležaljki</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </>
        );
      case 'Radnik':
        return (
          <>
            <li><Link to="/radnik" onClick={closeBurgerMenu}>Home</Link></li>
            <li><Link to="/radnik-zahtev-za-posao" onClick={closeBurgerMenu}>Zahtev za posao</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </>
        );
      case 'Admin':
        return (
          <>
            <li><Link to="/administrator" onClick={closeBurgerMenu}>Home</Link></li>
            <li><Link to="/administrator-obrada-zahteva" onClick={closeBurgerMenu}>Obrada zahteva</Link></li>
            <li><Link to="/administrator-admin-panel" onClick={closeBurgerMenu}>Admin panel</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </>
        );
      default:
        return (
          <>
            <li><Link to="/" onClick={closeBurgerMenu}>Home</Link></li>
            <li><Link to="/login" onClick={closeBurgerMenu}>Login</Link></li>
            <li><Link to="/register" onClick={closeBurgerMenu}>Register</Link></li>
            <li><Link to="/about" onClick={closeBurgerMenu}>About</Link></li>
          </>
        );
    }
  };

  return (
    <div className='navbar'>
      <img src={theme === 'light' ? logo_light : logo_dark} alt='' className='logo' />
      <ul className={`${theme} ${burgerMenuOpen ? 'active' : ''}`}>
        {getMenuItems()}
      </ul>
      <img onClick={toggle_mode} src={theme === 'light' ? toggle_light : toggle_dark} alt='' className='toggle-icon' />
      <button className="menu-icon-black" onClick={toggleBurgerMenu}>
        {burgerMenuOpen ? (theme === 'light' ? <RxCross2 /> : <RxCross2 color="white" />)
          : (theme === 'light' ? <IoMenu /> : <IoMenu color="white" />)}
      </button>
    </div>
  );
};

export default Navbar;
