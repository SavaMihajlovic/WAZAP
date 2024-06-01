import React, {useState, useEffect} from 'react'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import KupovinaKarataForm from '../../components/KupovinaKarataForm/KupovinaKarataForm'

export const KupovinaKarata = () => {

  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {

      setLoading(true);

      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userID = decodedToken.KorisnikID;

        const response = await axios.get(`http://localhost:5212/ZahtevIzdavanje/GetMyRequest/${userID}`);
        setApiResponse(response.data);

      } catch (error) {
        console.error(error.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() =>{
  },[apiResponse])

  return (
    apiResponse  && apiResponse.status === 'Nema poslatih zahteva' ?
    (
    <div className="kupovina-karata-content">
      <KupovinaKarataForm apiResponse={apiResponse} />
      {loading && (<div className='loading-container'> <LoadingSpinner /></div>)}
    </div>
    )
    :
    (
      <>
        <KupovinaKarataForm apiResponse={apiResponse} />
        {loading && (<div className='loading-container'> <LoadingSpinner /></div>)}
      </>
    )
  )
}
