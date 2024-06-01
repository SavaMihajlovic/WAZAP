import React, { useState, useEffect } from 'react';
import './KupovinaKarataForm.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const KupovinaKarataForm = ({apiResponse}) => {
  const [data, setData] = useState({
    selectedFileLicnaSlika: null,
    selectedFileSlikaUverenja: null,
    selectedOption: ''
  });

  const [showInputsError, setShowInputsError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {

  if(apiResponse && apiResponse.status === "readyForPayment") {
      const makePaymentKarta = async () => {

        setLoading(true);
        try {

        const response = await axios.post(`http://localhost:5212/Paypal/MakePaymentKarta/${apiResponse.id}/${apiResponse.tip_Karte}/${apiResponse.uverenje === null ? 'false' : 'true'}`);

        if(response.data && response.status === 200)
          window.location.href = response.data;
        } catch (error) {
          console.error(error.message);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      }
      makePaymentKarta();
   };
  }, [apiResponse]);

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setData({
      ...data,
      [name]: files ? files[0] : value // Ako je input tipa file, uzmi files[0], inače uzmi value
    });
  };

  const handleSubmit = async () => {
    if (!data.selectedFileLicnaSlika || !data.selectedOption) {
      setShowInputsError(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.KorisnikID;

      const formData = new FormData();
      formData.append('slika', data.selectedFileLicnaSlika);
      formData.append('uverenje', data.selectedFileSlikaUverenja);

      const response = await axios.post(`http://localhost:5212/ZahtevIzdavanje/AddRequest/${userID}/${data.selectedOption}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200 && response.data === 'Zahtev je uspešno poslat') {
        navigate('/');
      }

    } catch (error) {
      console.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
     apiResponse && apiResponse === "Nema poslatih zahteva" ? (
        <div className="kupovina-container">
          <div className="header">
            <div className="text">Kupovina Karata</div>
            <div className="underline"></div>
          </div>
          <div className="inputs">
            <div className={showInputsError && !data.selectedFileLicnaSlika ? "slika-input error" : "slika-input"}>
              <input type="file" id="licna-slika" accept=".png" name="selectedFileLicnaSlika" onChange={handleInputChange} />
            </div>
            <label className="input-message">Unesite svoju ličnu sliku</label>
            <div className="slika-input">
              <input type="file" id="slika-uverenja" accept=".png" name="selectedFileSlikaUverenja" onChange={handleInputChange} />
            </div>
            <label className="input-message">Unesite sliku uverenja sa fakulteta</label>
            <div className="radio-buttons">
              <label>
                <input type="radio" name="selectedOption" value="mesecna" checked={data.selectedOption === 'mesecna'} onChange={handleInputChange} /> Mesečna karta
              </label>
              <label>
                <input type="radio" name="selectedOption" value="polumesecna" checked={data.selectedOption === 'polumesecna'} onChange={handleInputChange} /> Polumesečna karta
              </label>
            </div>
            {showInputsError && <div className="error-message">Mora da postoji korisnikova slika i tip karte!</div>}
          </div>
          <div className="submit-container">
            <button className="submit" onClick={handleSubmit}>Pošalji zahtev</button>
          </div>
        </div>
     ) : apiResponse && apiResponse.status === 'pending' ?
     (
      <div className="status-container">
        <div className="status-header">
          <div className="status-text">Poslaćemo Vam email poruku kad zahtev bude obrađen.</div>
          <div className="status-underline"></div>
        </div>
        <button className="go-back-button" onClick={handleGoBack}>Idi nazad na stranicu</button>
      </div>
     ) : apiResponse && apiResponse.status === 'completed' ?
     (
      <div className="status-container">
            <div className="status-header">
              <div className="status-text">
                Vaš zahtev je odobren i važi od <span className='red-text'>{formatDate(apiResponse.datumOd)}</span> do <span className='red-text'>{formatDate(apiResponse.datumDo)}</span>
                </div>
              <div className="status-underline"></div>
          </div>
            <button className="go-back-button" onClick={handleGoBack}>Idi nazad na stranicu</button>
          </div>
     ) : (loading && <div className='loading-container'> <LoadingSpinner /></div>)
  );
};

export default KupovinaKarataForm;
