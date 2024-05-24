import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './PaymentSuccessForm.css';
import collaborationImage from '../../../assets/wazapxpaypal.png';
import { jwtDecode } from 'jwt-decode';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';

const PaymentSuccessForm = ({ easyChairIDs, date, paymentToken }) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(false);

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

        const reservationResponse = await axios.post(`http://localhost:5212/Rezervacije/MakeAReservation/${userID}/${date}`,easyChairIDs);

        if(reservationResponse.status === 200) {
          setShowConfirmation(false);
          navigate(`/${path}`); 
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
    <div className="payment-container">
      <div className="payment-header">
        <div className="payment-text">Uspešno kreiran zahtev za plaćanje</div>
        <div className="payment-underline"></div>
      </div>
      <div className="payment-buttons">
        <button className="capsule-button" onClick={handleConfirmPayment}>Potvrdi plaćanje</button>
        <button className="capsule-button" onClick={handleCancelPayment}>Otkaži plaćanje</button>
      </div>
      <div className="collaboration-image-container">
        <img src={collaborationImage} alt="WhatsApp and PayPal Collaboration" width='250px' />
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
  );
};

export default PaymentSuccessForm;
