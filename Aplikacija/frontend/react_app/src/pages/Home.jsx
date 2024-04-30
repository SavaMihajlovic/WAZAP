import React from 'react'
import { Link } from 'react-router-dom';
import videoBG from '../assets/videoBG.mp4'
import Footer from '../components/Footer/Footer';

export const Home = ({theme}) => {
  return (
    <div className='main'>

      <video src={videoBG} autoPlay loop muted className='fullscreen-video'/>
      <div className='overlay'></div>

      <div className='content'>
        <h1>Welcome</h1>
        <p>To WAZAP.</p>
        <Link to="/about" className="about-button">About us</Link>
        <Footer theme={theme} />
      </div>
    </div>
  )
}
