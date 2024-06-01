import React, {useState, useEffect} from 'react'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import ZahtevZaPosaoForm from '../../components/ZahtevZaPosaoForm/ZahtevZaPosaoForm'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

export const ZahtevZaPosao = () => {

  const [status, setStatus] = useState("Nema poslatih zahteva");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {

      setLoading(true);

      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userID = decodedToken.KorisnikID;

        const response = await axios.get(`http://localhost:5212/ZahtevPosao/GetMyRequest/${userID}`);
        if(response.data.status === 'completed')
          setStatus('completed');
        else if (response.data.status === 'pending')
          setStatus('pending');
        else
          setStatus('Nema poslatih zahteva');

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
  },[status])

  return (
    status === "Nema poslatih zahteva" ?
    (
    <div className="zahtev-posao-content">
      <ZahtevZaPosaoForm status={status} />
      {loading && (<div className='loading-container'> <LoadingSpinner /></div>)}
    </div>
    )
    :
    (
      <>
        <ZahtevZaPosaoForm status={status} />
        {loading && (<div className='loading-container'> <LoadingSpinner /></div>)}
      </>
    )
  )
}
