import React from 'react';
import './Footer.css';

const Footer = ({ theme, userType }) => {
    return (
        <footer className={`footer ${theme}`}>
            <div className="container">
                <p className={`description ${theme}`}>© 2024 Solution4 <span className={userType === undefined ? 'hidden' : '' } >{`- ${userType}`}</span></p>
            </div>
        </footer>
    );
};

export default Footer;
