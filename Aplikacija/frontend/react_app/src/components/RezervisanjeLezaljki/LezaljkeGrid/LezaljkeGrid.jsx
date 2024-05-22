import React, { useEffect, useState } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';

const LezaljkeGrid = ({ lezaljke, freeLezaljke, showFreeLezaljke, 
                        reservedLezaljke, showReservedLezaljke, setChecked }) => {

  const [checkedLezaljke, setCheckedLezaljke] = useState([]);

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
      if (checkedLezaljke.length < 3) {
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
      <Grid templateColumns='repeat(5, 1fr)' gap={20} margin={30}>
        {showFreeLezaljke && lezaljke.map((lezaljka) => {

          // uslovi
          const isFree = isLezaljkaFree(lezaljka.id);
          const isChecked = isLezaljkaChecked(lezaljka.id);
          const canBeChecked = checkedLezaljke.length < 3 || isChecked;

          return (
            <GridItem
              key={lezaljka.id}
              w='200px'
              h='80px'
              bg={isChecked ? 'red' : (isFree ? '#008000' : '#6a89cc')}
              p={4}
              style={{ visibility: isFree ? 'visible' : 'hidden', cursor: isFree && canBeChecked ? 'pointer' : 'not-allowed' }}
              onClick={() => { if (isFree && canBeChecked) toggleChecked(lezaljka.id) }}
            >
              <div>ID: {lezaljka.id}</div>
              <div>Cena: {lezaljka.cena}</div>
            </GridItem>
          );
        })}
        {showReservedLezaljke && lezaljke.map((lezaljka) => (
          <GridItem
            key={lezaljka.id}
            w='200px'
            h='80px'
            bg={isLezaljkaReserved(lezaljka.id) ? '#ff0000' : '#6a89cc'}
            p={4}
            style={{ visibility: isLezaljkaReserved(lezaljka.id) ? 'visible' : 'hidden' }}
          >
            <div>ID: {lezaljka.id}</div>
            <div>Cena: {lezaljka.cena}</div>
          </GridItem>
        ))}
        {(!showFreeLezaljke && !showReservedLezaljke) && lezaljke.map((lezaljka) => (
          <GridItem
            key={lezaljka.id}
            w='200px'
            h='80px'
            bg='#6a89cc'
            p={4}
          >
            <div>ID: {lezaljka.id}</div>
            <div>Cena: {lezaljka.cena}</div>
          </GridItem>
        ))}
      </Grid>
    </div>
  );
};

export default LezaljkeGrid;
