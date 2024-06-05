import React, {useState, useEffect } from 'react';
import Footer from '../components/Footer/Footer';
import pool from '../assets/swimming-pool-with-stair.png'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

export const About = ({ theme }) => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
    <div className='about-content'>
    <img src={pool} alt="Pool" className="pool-with-stair" />
     <div className="about-infos-container">
        <ul className='about-infos'>
          <li className='about-info' style={{marginTop: '20px'}}>&#8226; WAZAP je osnovan od strane kompanije Solution4 2024. godine.</li>
          <li className='about-info'>&#8226; Pruža razne mogućnosti kao što su online rezervacija karata i ležaljki, kao i podnošenje zahteva za sezonski posao u akva parku. </li>
          <li className='about-info'>&#8226; Projekat je zamišljen da stalnim korisnicima akva parka omogući da u svakom trenutku na najlakši način dođu do svoje karte i ležaljke na bazenu.</li>
        </ul>
    </div>

    <div className="map-container">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2871.6227898213333!2d21.264614975385083!3d43.96716863206889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4756c4050037b387%3A0x8cf50cdab21f4199!2z0JDQutCy0LAg0J_QsNGA0Log0IjQsNCz0L7QtNC40L3QsA!5e0!3m2!1ssr!2srs!4v1717583566499!5m2!1ssr!2srs"
        width="400"
        height="300"
        style={{ border: "2px solid white" }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps"
      ></iframe>
    </div>
  </div>
  <Footer theme={theme} />
  {loading && (<div className='loading-container'> <LoadingSpinner /></div>)}
  </>
  );
};
