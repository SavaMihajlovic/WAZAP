import React, { useState, useEffect } from 'react';
import './KupovinaKarataForm.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const KupovinaKarataForm = () => {
  const [data, setData] = useState({
    selectedFileLicnaSlika: null,
    selectedFileSlikaUverenja: null,
    selectedOption: ''
  });

  const [showInputsError, setShowInputsError] = useState(false);
  const [requestStatus, setRequestStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const status = localStorage.getItem('requestStatus');
    if (status === 'pending') {
      setLoading(true);
    } else {
      setLoading(false);
      //navigate('/kupovina-karata');
    }
  }, []);

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
        setRequestStatus('pending');
        localStorage.setItem('requestStatus', 'pending');
        console.log(response.data);
        navigate('/');
      }

    } catch (error) {
      setRequestStatus('error');
      localStorage.setItem('requestStatus', 'error');
    }
  };

  return (
    <>
      {requestStatus !== 'pending' ? (
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
      ) : (
           <div className='message-container'>
              <div className='request-message'>Poslaćemo Vam email poruku kad zahtev bude obrađen.</div>
          </div>
      )}
    </>
  );
};

export default KupovinaKarataForm;
