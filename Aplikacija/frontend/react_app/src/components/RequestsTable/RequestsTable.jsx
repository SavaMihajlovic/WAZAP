import React, { useState } from 'react';
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr, Checkbox, Input, Box, Button, ChakraProvider } from '@chakra-ui/react';
import './RequestsTable.css';

const RequestsTable = ({theme}) => {

  const [selectedType, setSelectedType] = useState('ZahtevIzdavanje');

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const zahtevIzdavanjeData = [
    { id: 1, tipKarte: 'Tip 1', status: 'Aktivan', kid: '123', aid: '456', datumOd: '01-01-2024', datumDo: '01-02-2024' },
    { id: 2, tipKarte: 'Tip 2', status: 'Neaktivan', kid: '789', aid: '012', datumOd: '02-01-2024', datumDo: '02-02-2024' },
  ];

  const zahtevPosaoData = [
    { id: 1, tipPosla: 'Posao 1', status: 'Završen', opis: 'Opis 1', srid: '345', aid: '678' },
    { id: 2, tipPosla: 'Posao 2', status: 'U toku', opis: 'Opis 2', srid: '901', aid: '234' },
  ];

  return (
    <ChakraProvider>
      <Box className="select-menu" p={4}>
      <select onChange={handleTypeChange} value={selectedType} mb={4} className="select-request">
            <option value="ZahtevIzdavanje">Zahtev Izdavanje</option>
            <option value="ZahtevPosao">Zahtev Posao</option>
       </select>

        <Checkbox borderColor={theme === 'dark' ? 'white' : 'black'} 
                  fontWeight='bold' p={2} mr={4}
                  color={theme === 'dark' ? 'white' : 'black'}>Odobren</Checkbox>

        <Checkbox borderColor={theme === 'dark' ? 'white' : 'black'} 
                  fontWeight='bold' p={2} mr={4}
                  color={theme === 'dark' ? 'white' : 'black'}>Na čekanju</Checkbox>

        {selectedType === 'ZahtevIzdavanje' &&
        (<Checkbox borderColor={theme === 'dark' ? 'white' : 'black'} 
                  fontWeight='bold' p= {2} mr={4}
                  color={theme === 'dark' ? 'white' : 'black'}>Spreman za plaćanje</Checkbox>)}

        <Checkbox borderColor={theme === 'dark' ? 'white' : 'black'} 
                  fontWeight='bold' p= {2} mr={4}
                  color={theme === 'dark' ? 'white' : 'black'}>Odbijen</Checkbox>


        <Button width='150px' mr={4} ml={20}
                bg={theme === 'dark' ? '#32cd32' : 'green'} color='white' _hover={'none'}>Odobri zahtev</Button>
        <Button width='150px' mr={4}
                bg='red' color='white' _hover={'none'}>Odbij zahtev</Button>

        <TableContainer marginTop={10}> 
          <Table variant="striped">
            <Thead color={theme === 'dark' ? 'white' : 'black'}>
              {selectedType === 'ZahtevIzdavanje' ? (
                <Tr>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>ID</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Tip karte</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Status</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>KID</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>AID</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Datum od</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Datum do</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Verifikacija zahteva</Th> 
                </Tr>
              ) : (
                <Tr>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>ID</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Tip posla</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Status</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Opis</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>SRID</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>AID</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Verifikacija zahteva</Th> 
                </Tr>
              )}
            </Thead>
            <Tbody>
              {selectedType === 'ZahtevIzdavanje'
                ? zahtevIzdavanjeData.map((row,index) => (
                    <Tr key={row.id}
                     bg={theme === 'dark' ? '#333' : '#d6e2ff'} 
                     textColor ={index % 2 === 0 ? (theme === 'dark' ? 'black' : 'black') : (theme === 'dark' ? 'white' : 'black')}>
                      <Td border='none'>{row.id}</Td>
                      <Td border='none'>{row.tipKarte}</Td>
                      <Td border='none'>{row.status}</Td>
                      <Td border='none'>{row.kid}</Td>
                      <Td border='none'>{row.aid}</Td>
                      <Td border='none'>{row.datumOd}</Td>
                      <Td border='none'>{row.datumDo}</Td>
                      <Td border='none'>
                        <Button 
                            width='150px' 
                            bg={theme === 'dark' ? '#666' : '#b5bfe6'} 
                            color={(theme === 'dark' ? 'white' : 'black')} _hover={'none'}>Prikaži
                        </Button></Td>
                    </Tr>
                  ))
                : zahtevPosaoData.map((row,index) => (
                    <Tr key={row.id}
                    bg={theme === 'dark' ? '#333' : '#d6e2ff'} 
                     textColor ={index % 2 === 0 ? (theme === 'dark' ? 'black' : 'black') : (theme === 'dark' ? 'white' : 'black')}>
                      <Td border='none'>{row.id}</Td>
                      <Td border='none'>{row.tipPosla}</Td>
                      <Td border='none'>{row.status}</Td>
                      <Td border='none'>{row.opis}</Td>
                      <Td border='none'>{row.srid}</Td>
                      <Td border='none'>{row.aid}</Td>
                      <Td border='none'>
                        <Button width='150px' 
                            bg={theme === 'dark' ? '#666' : '#b5bfe6'} 
                            color={(theme === 'dark' ? 'white' : 'black')}>Prikaži</Button></Td>
                    </Tr>
                  ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </ChakraProvider>
  );
}

export default RequestsTable;
