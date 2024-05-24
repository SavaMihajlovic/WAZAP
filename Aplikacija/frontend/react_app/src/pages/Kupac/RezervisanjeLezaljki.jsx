import React, {useState, useEffect} from 'react'
import { Menu } from '../../components/RezervisanjeLezaljki/Menu/Menu';
import LezaljkeGrid from '../../components/RezervisanjeLezaljki/LezaljkeGrid/LezaljkeGrid';
import axios from 'axios';

export const RezervisanjeLezaljki = () => {

  const [lezaljke, setLezaljke] = useState([]);
  const [freeLezaljke, setFreeLezaljke] = useState([]);
  const [reservedLezaljke, setReservedLezaljke] = useState([]);
  const [checkedLezaljke, setCheckedLezaljke] = useState([]);
  const [showFreeLezaljke, setShowFreeLezaljke] = useState(false);
  const [showReservedLezaljke, setShowReservedLezaljke] = useState(false);
  const [checked, setChecked] = useState(0);

  useEffect(() => {
    async function fetchLezaljke() {
      try {
        const lezaljke = await axios.get('http://localhost:5212/Lezaljka/GetAllLezaljke');
        
        if (lezaljke.data && typeof lezaljke.data === 'object') {
          const lezaljkeArray = Object.values(lezaljke.data);
          setLezaljke(lezaljkeArray);

        } else {
          console.error('Podaci nisu u očekivanom formatu (objekat).');
        }
      } catch (error) {
        console.error('Greška prilikom dobijanja podataka:', error);
      }
    }

    fetchLezaljke();
  }, []);

  return (
    <div className="rezervisanje-lezaljki">
      <div className="menu-content">
        <Menu setFreeLezaljke={setFreeLezaljke} showFreeLezaljke={showFreeLezaljke}
              setShowFreeLezaljke={setShowFreeLezaljke} setReservedLezaljke={setReservedLezaljke}
              showReservedLezaljke={showReservedLezaljke} setShowReservedLezaljke={setShowReservedLezaljke}
              checkedLezaljke={checkedLezaljke}/>
      </div>
      <div className="grid-content">
        <LezaljkeGrid lezaljke={lezaljke} freeLezaljke={freeLezaljke}
                      showFreeLezaljke={showFreeLezaljke} reservedLezaljke={reservedLezaljke}
                      showReservedLezaljke={showReservedLezaljke} setChecked={setChecked}
                      checkedLezaljke={checkedLezaljke} setCheckedLezaljke={setCheckedLezaljke}/>
      </div>
      <div className="counter-checked">
         <p> Selektovano ležaljki: {checked}</p>
      </div>
    </div>
  );
}
