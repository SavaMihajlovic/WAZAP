import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './PaymentSuccessForm.css';
import collaborationImage from '../../../assets/wazapxpaypal.png';
import { jwtDecode } from 'jwt-decode';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';

const PaymentSuccessForm = ({ easyChairIDs, date, paymentToken, reqID, typeOfCard, uverenje }) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(false);

  function formatDate(inputDatum) {
    let date1 = new Date(inputDatum);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = date1.getDate();
    let month = months[date1.getMonth()];
    let year = date1.getFullYear().toString().substr(-2);
    let time = date1.toLocaleTimeString('en-US');
    let formated = `${day}-${month}-${year} ${time}`;

    return formated;
}

  const handleConfirmPayment = () => {
    setShowConfirmation(true);
  };

  const handleCancelPayment = () => {
    navigate(`/${path}`);
  };

  const handleConfirmNo = () => {
    setShowConfirmation(false);
  };

  const handleConfirmYes = async () => {
    try {

      setLoading(true);

      const token = localStorage.getItem('token'); 
      const decodedToken = jwtDecode(token); 
      const userID = decodedToken.KorisnikID;
      const role = decodedToken.Type;

    if(role === 'Kupac')
      setPath('kupac');
      const response = await axios.post(`http://localhost:5212/Paypal/ConfirmOrder/${paymentToken}`);

      if (response.data === "Uspešno plaćanje!") {

        if(reqID && typeOfCard && uverenje) {
          const paymentTicketResponse = await axios.post(`http://localhost:5212/ZahtevIzdavanje/CompletedPurchase/${reqID}`);

          if(paymentTicketResponse.status === 200) {
            setShowConfirmation(false);
            navigate(`/${path}`); 
        } else {

          date = formatDate(date);
          const reservationResponse = await axios.post(`http://localhost:5212/Rezervacije/MakeAReservation/${userID}/${date}`,easyChairIDs);
  
          if(reservationResponse.status === 200) {
            setShowConfirmation(false);
            navigate(`/${path}`); 
          }
        }
      }
    } else {
      console.error('Greška prilikom potvrde narudžbine:', response.data);
    }
    
    } catch (error) {
      console.error('Greška prilikom slanja zahteva:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    (easyChairIDs && date ?
    (
    <div className="payment-container">
      <div className="payment-header">
        <div className="payment-text">Uspešno kreiran zahtev za plaćanje ležaljki</div>
        <div className="payment-underline"></div>
      </div>
      <div className="payment-buttons">
        <button className="capsule-button" onClick={handleConfirmPayment}>Potvrdi plaćanje</button>
        <button className="capsule-button" onClick={handleCancelPayment}>Otkaži plaćanje</button>
      </div>
      <div className="collaboration-image-container">
        <img src={collaborationImage} alt="WAZAP and PayPal Collaboration" width='250px' />
      </div>

      {showConfirmation && (
        <div className="confirmation-dialog">
          <div className="confirmation-text">Da li ste sigurni da želite da nastavite sa plaćanjem?</div>
          <div className="confirmation-buttons">
            <button className="confirmation-button" onClick={handleConfirmYes}>Da</button>
            <button className="confirmation-button" onClick={handleConfirmNo}>Ne</button>
          </div>
        </div>
      )}
        {loading && (<div className='loading-container'> <LoadingSpinner /></div>)}
    </div>
    )
    :
    (
      <div className="payment-container">
      <div className="payment-header">
        <div className="payment-text">Uspešno kreiran zahtev za plaćanje karata</div>
        <div className="payment-underline"></div>
      </div>
      <div className="payment-buttons">
        <button className="capsule-button" onClick={handleConfirmPayment}>Potvrdi plaćanje</button>
        <button className="capsule-button" onClick={handleCancelPayment}>Otkaži plaćanje</button>
      </div>
      <div className="collaboration-image-container">
        <img src={collaborationImage} alt="WAZAP and PayPal Collaboration" width='250px' />
      </div>

      {showConfirmation && (
        <div className="confirmation-dialog">
          <div className="confirmation-text">Da li ste sigurni da želite da nastavite sa plaćanjem?</div>
          <div className="confirmation-buttons">
            <button className="confirmation-button" onClick={handleConfirmYes}>Da</button>
            <button className="confirmation-button" onClick={handleConfirmNo}>Ne</button>
          </div>
        </div>
      )}
        {loading && (<div className='loading-container'> <LoadingSpinner /></div>)}
    </div>
    ))
  );
};

export default PaymentSuccessForm;