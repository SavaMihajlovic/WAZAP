import React from 'react';
import  './Footer.css';

const Footer = ({ theme }) => {
    return (
        <footer className={`footer ${theme}`}>
            <div className="container">
                <p className={`description ${theme}`}>© 2024 Solution4</p>
            </div>
        </footer>
    );
};

export default Footer;