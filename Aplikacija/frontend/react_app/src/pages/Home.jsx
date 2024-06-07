import React, {useEffect}from 'react'
import { Link, useNavigate } from 'react-router-dom';
import videoBG from '../assets/videoBG.mp4'
import Footer from '../components/Footer/Footer';
import { jwtDecode } from 'jwt-decode';

export const Home = ({theme}) => {

  const navigate = useNavigate();

  useEffect(() => {

    const redirectToCorrectPage = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const { Type, exp } = decoded;

        if (exp * 1000 < Date.now()) {

          localStorage.removeItem('token'); // brisemo token
          return;
        }

        switch (Type) {
          case 'Kupac':
            navigate('/kupac');  
            break;
          case 'Radnik':
            navigate('/radnik');
            break;
          case 'Admin':
            navigate('/administrator');
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Invalid token', error);
      }
    };

    redirectToCorrectPage();
  }, [navigate]);

  return (
    <div className='main'>

      <video src={videoBG} autoPlay loop muted className='fullscreen-video'/>
      <div className='overlay'></div>

      <div className='content'>
        <h1>Dobrodošli</h1>
        <p>na WAZAP.</p>
        <Link to="/about" className="about-button">O nama</Link>
        <Footer theme={theme} />
      </div>
    </div>
  )
}

