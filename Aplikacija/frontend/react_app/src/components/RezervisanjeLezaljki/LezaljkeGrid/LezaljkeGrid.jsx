import React, { useEffect, useState } from 'react';
import '../LezaljkeGrid/LezaljkeGrid.css';

const LezaljkeGrid = ({ lezaljke, freeLezaljke, showFreeLezaljke, 
                        reservedLezaljke, showReservedLezaljke, setChecked,
                        checkedLezaljke, setCheckedLezaljke }) => {

  const [maxChecked, setMaxChecked] = useState(3);

  const isLezaljkaFree = (id) => {
    return freeLezaljke.some(o => o.id === id);
  };

  const isLezaljkaReserved = (id) => {
    return reservedLezaljke.some(o => o.id === id);
  };

  const isLezaljkaChecked = (id) => {
    return checkedLezaljke.includes(id);
  };

  const toggleChecked = (id) => {
    const index = checkedLezaljke.indexOf(id);
    if (index === -1) {
      if (checkedLezaljke.length + reservedLezaljke.length < maxChecked) {
        setCheckedLezaljke([...checkedLezaljke, id]);
      }
    } else {
      const newCheckedLezaljke = [...checkedLezaljke];
      newCheckedLezaljke.splice(index, 1);
      setCheckedLezaljke(newCheckedLezaljke);
    }
  };

  useEffect(() => {
    setChecked(checkedLezaljke.length);
  }, [freeLezaljke, reservedLezaljke, setChecked, checkedLezaljke]);

  return (
    <div className="grid-container">
      {showFreeLezaljke && (
        <div className="grid">
          {lezaljke.map((lezaljka) => {
            const isFree = isLezaljkaFree(lezaljka.id);
            const isChecked = isLezaljkaChecked(lezaljka.id);
            const canBeChecked = checkedLezaljke.length + reservedLezaljke.length < maxChecked || isChecked;
            const gridItemClassName = 'grid-item';

            return (
              <div
                key={lezaljka.id}
                className={gridItemClassName}
                onClick={() => { if (isFree && canBeChecked) toggleChecked(lezaljka.id) }}
                style={{
                  visibility: isFree ? 'visible' : 'hidden',
                  cursor: isFree && canBeChecked ? 'pointer' : 'not-allowed',
                  backgroundColor: isChecked ? 'red' : (isFree ? '#008000' : '#6a89cc')
                }}
              >
                <div>ID: {lezaljka.id}</div>
                <div>Cena: {lezaljka.cena}</div>
              </div>
            );
          })}
        </div>
      )}

      {showReservedLezaljke && (
        <div className="grid">
          {lezaljke.map((lezaljka) => {
            const isReserved = isLezaljkaReserved(lezaljka.id);
            let gridItemClassName = 'grid-item';
            
            return (
              <div
                key={lezaljka.id}
                className={gridItemClassName}
                style={{
                  visibility: isReserved ? 'visible' : 'hidden',
                  backgroundColor: isReserved ? '#ff0000' : '#6a89cc'
                }}
              >
                <div>ID: {lezaljka.id}</div>
                <div>Cena: {lezaljka.cena}</div>
              </div>
            );
          })}
        </div>
      )}

      {!showFreeLezaljke && !showReservedLezaljke && (
        <div className="grid">
          {lezaljke.map((lezaljka) => (
            <div
              key={lezaljka.id}
              className="grid-item"
            >
              <div>ID: {lezaljka.id}</div>
              <div>Cena: {lezaljka.cena}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LezaljkeGrid;
