import React, { useState } from 'react';
import './Menu.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const Menu = ({setFreeLezaljke,showFreeLezaljke,
                      setShowFreeLezaljke,setReservedLezaljke,
                      showReservedLezaljke, setShowReservedLezaljke}) => {

  const [date, setDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [dateError, setDateError] = useState(false);

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const today = new Date();
    const differenceInDays = Math.floor((selectedDate - today) / (1000 * 3600 * 24)) + 1; // + 1 zbog greske

    if (differenceInDays >= 0 && differenceInDays <= 3) {

      setDate(event.target.value);
      setDateError(false);
      setErrorMessage("");
      
    } else {
      setErrorMessage("Moguće je videti rezervacije samo za danas i 3 dana unapred!");
      setDateError(true);
    }
  
    setDate(event.target.value);
  };

  // Prikaz slobodnih lezaljki

  const showFreeEasyChairs = async () => {
    
    if(dateError || !date) {
      return;
    }

    try {
    
      const response = await axios.get(`http://localhost:5212/Lezaljka/GetAllFree/${date}`);

      if (response.data && typeof response.data == "object") {
        const freelezaljkeArray = Object.values(response.data);
        setFreeLezaljke(freelezaljkeArray);
        //setShowFreeLezaljke(!showFreeLezaljke);
        if(showFreeLezaljke === true && showReservedLezaljke === false) {
          setShowFreeLezaljke(false); 
        }
        else {
          setShowFreeLezaljke(true);
          setShowReservedLezaljke(false);
        }

        
      } else {
        console.error('Podaci nisu u očekivanom formatu (objekat).');
      }
    } catch (error) {
      console.error('Greška prilikom dobijanja podataka:', error);
    }
  };

  // Prikaz korisnikovih rezervacija

  const showMyReservations = async () => {
  if (dateError || !date) {
    return;
  }

  try {

    const token = localStorage.getItem('token'); 
    const decodedToken = jwtDecode(token); 
    const userID = decodedToken.KorisnikID;

    const response = await axios.get(`http://localhost:5212/Rezervacije/GetReservations/${userID}/${date}`);
    
    if (response.data && typeof response.data === "object") {
      const reservationsArray = Object.values(response.data);
      setReservedLezaljke(reservationsArray);
      //setShowReservedLezaljke(!showReservedLezaljke);
      if(showReservedLezaljke === true && showFreeLezaljke === false) {
        setShowReservedLezaljke(false); 
      }
      else {
        setShowReservedLezaljke(true);
        setShowFreeLezaljke(false);
      }

    } else {
      console.error('Podaci nisu u očekivanom formatu (objekat).');
    }
  } catch (error) {
    console.error('Greška prilikom dobijanja podataka:', error);
  }
};

  const makeReservation = () => {
    console.log('Napravi rezervaciju za datum:', date);
  };

  return (
    <div className="menu-container">
      <div className="menu-elements">
        <div className={`menu-date-input ${dateError ? 'error': ''}`}>
          <input type="date" value={date} onChange={handleDateChange}/>
        </div>
        <div className="button-container">
          <button onClick={showFreeEasyChairs} className="menu-button green">
            Slobodne ležaljke
          </button>
          <button onClick={showMyReservations} className="menu-button red">
            Moje rezervacije
          </button>
          <button onClick={makeReservation} className="menu-button blue">
            Napravi rezervaciju
          </button>
        </div>
      </div>
      {dateError && <div className="error-container">
        <div className="error-message">{errorMessage}</div>
      </div>}
    </div>
  );
};

export default Menu;
