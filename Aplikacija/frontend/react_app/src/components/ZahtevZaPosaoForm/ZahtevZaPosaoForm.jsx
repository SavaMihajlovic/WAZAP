import React, { useState } from 'react';
import './ZahtevZaPosaoForm.css'; 
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ZahtevZaPosaoForm = ({status}) => {

  const [data, setData] = useState({
    selectedFileLicnaSlika: null,
    selectedOption: '',
    motivacionoPismo: '',
    dodatniInput: ''
  });

  const [showInputsError, setShowInputsError] = useState(false);
  const [showDodatniInput, setShowDodatniInput] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setData({
      ...data,
      [name]: files ? files[0] : value
    });

    if (name === 'selectedOption' && value === 'Spasilac') {
      setShowDodatniInput(true);
    } else if (name === 'selectedOption') {
      setShowDodatniInput(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!data.selectedFileLicnaSlika || !data.selectedOption || !data.motivacionoPismo
         || (showDodatniInput && !data.dodatniInput)) {
      setShowInputsError(true);
      return;
    }

    try {

      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.KorisnikID;

      const formData = new FormData();
      formData.append('slika', data.selectedFileLicnaSlika);
      formData.append('sertifikat', data.dodatniInput);

    await axios.post(`http://localhost:5212/ZahtevPosao/AddRequest/${userID}/${data.selectedOption}`, formData, {
      params: {
       opis: data.motivacionoPismo
      },
       headers: {
          'Content-Type' : 'multipart/form-data'
      }
    });

    navigate('/');

    } catch (error) {
      console.error('Greška pri slanju zahteva', error);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

    return (
        status === "Nema poslatih zahteva" ? (
          <div className="zahtev-posao-container">
            <div className="header">
              <div className="text">Zahtev za Posao</div>
              <div className="underline"></div>
            </div>
            <div className="inputs">
              <div className={showInputsError && !data.selectedFileLicnaSlika ? "slika-input error" : "slika-input"}>
                <input type="file" id="licna-slika" accept=".png" name="selectedFileLicnaSlika" onChange={handleInputChange} />
              </div>
              <label className="input-message">Unesite svoju ličnu sliku</label>
              <div className="radio-buttons">
                <label>
                  <input type="radio" name="selectedOption" value="Spasilac" checked={data.selectedOption === 'Spasilac'} onChange={handleInputChange} /> Spasilac
                </label>
                <label>
                  <input type="radio" name="selectedOption" value="Čistač bazena" checked={data.selectedOption === 'Čistač bazena'} onChange={handleInputChange} /> Čistač bazena
                </label>
                <label>
                  <input type="radio" name="selectedOption" value="Prodavac karata" checked={data.selectedOption === 'Prodavac karata'} onChange={handleInputChange} /> Prodavac karata
                </label>
              </div>
              {showDodatniInput && (
                  <>
                <div className={showInputsError && !data.dodatniInput ? "slika-input error" : "slika-input"}>
                  <input type="file" id="dodatni-input" accept=".png" name="dodatniInput" onChange={handleInputChange} />
                </div>
                <label className="input-message">Unesite sliku sertifikata</label>
                  </>
              )}
              <div className="text-area">
                <textarea name="motivacionoPismo" placeholder="Unesite motivaciono pismo" value={data.motivacionoPismo} onChange={handleInputChange}/>
              </div>
              {showInputsError && <div className="error-message">Sva polja moraju biti popunjena!</div>}
            </div>
            <div className="submit-container">
              <button className="submit" onClick={handleSubmit}>Pošalji zahtev</button>
            </div>
          </div>
        ) : status && status === "pending" ? (
          <div className="status-container">
            <div className="status-header">
              <div className="status-text">Poslaćemo Vam email poruku kad zahtev bude obrađen.</div>
              <div className="status-underline"></div>
          </div>
            <button className="go-back-button" onClick={handleGoBack}>Idi nazad na stranicu</button>
          </div>
        ) : status && status === "completed" ? (
          <div className="status-container">
            <div className="status-header">
              <div className="status-text">Vaš zahtev je odobren.</div>
              <div className="status-underline"></div>
          </div>
            <button className="go-back-button" onClick={handleGoBack}>Idi nazad na stranicu</button>
          </div>
        ) : <div>Status nije poznat.</div>
      );
};

export default ZahtevZaPosaoForm;
