import React, { useState } from 'react'
import './Navbar.css'
import logo_light from '../../assets/logo-black.png'
import logo_dark from '../../assets/logo-white.png'
import toggle_light from '../../assets/night.png'
import toggle_dark from '../../assets/day.png'
import { Link } from 'react-router-dom'
import { IoMenu } from 'react-icons/io5';
import { RxCross2 } from "react-icons/rx";


const Navbar = ({theme,setTheme}) => {

    const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);

    const toggleBurgerMenu = () => {
        setBurgerMenuOpen(!burgerMenuOpen);
    };

    const toggle_mode = () => {
        theme == 'light' ? setTheme('dark') : setTheme('light');
    }

    const closeBurgerMenu = () => {
        setBurgerMenuOpen(false);
    }

  return (
    <div className='navbar'>
        <img src={theme == 'light' ? logo_light : logo_dark} alt='' className='logo' />

                <ul className={`${theme} ${burgerMenuOpen ? 'active' : ''}`}>
                <li><Link to ="/" onClick={closeBurgerMenu}>Home</Link></li>
                <li><Link to ="/login" onClick={closeBurgerMenu}>Login</Link></li>
                <li><Link to ="/register" onClick={closeBurgerMenu}>Register</Link></li>
                <li><Link to ="/about" onClick={closeBurgerMenu}>About</Link></li>
            </ul>

        <img onClick={() => {toggle_mode()}} src={theme == 'light' ? toggle_light : toggle_dark} alt='' className='toggle-icon' />

        <button className="menu-icon-black" onClick={() => toggleBurgerMenu()}>
            {burgerMenuOpen ? (theme === 'light' ? <RxCross2 /> : <RxCross2 color="white" />)
            : (theme === 'light' ? <IoMenu /> : <IoMenu color="white" />)}
        </button>
    </div>
  )
}

export default Navbar