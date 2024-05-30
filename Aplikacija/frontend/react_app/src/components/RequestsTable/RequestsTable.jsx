import React, { useState, useEffect } from 'react';
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr, Button, Box, ChakraProvider, Modal,
         ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter 
 } from '@chakra-ui/react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './RequestsTable.css';


const RequestsTable = ({ theme }) => {
  const [selectedType, setSelectedType] = useState('ZahtevIzdavanje');
  const [selectedStatus, setSelectedStatus] = useState('Svi statusi');
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [opis, setOpis] = useState('');
  const [slikaLica,setSlikaLica] = useState('');
  const [slikaUverenja,setSlikaUverenja] = useState('');
  const [slikaSertifikata,setSlikaSertifikata] = useState('');

  const handleTypeChange = async (e) => {
    const type = e.target.value;
    setSelectedType(type);
    await fetchData(type);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const fetchData = async (type) => {
    try {
      const response = await axios.get(`http://localhost:5212/${type === 'ZahtevIzdavanje' ? 'ZahtevIzdavanje' : 'ZahtevPosao'}/GetAll`);
      setData(response.data);
    } catch (error) {
      console.error('Greška pri prikupljanju podataka', error);
    }
  };

  useEffect(() => {
    fetchData(selectedType);
  }, [selectedType]);

  const filteredData = (data) => {
    if (selectedStatus === 'Svi statusi') {
      return data;
    }
    return data.filter((item) => item.status === selectedStatus);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row.id === selectedRow ? null : row.id);
  };

  const openDialog = async (request, row) => {
    setIsDialogOpen(true);

    if(selectedType === 'ZahtevPosao' && request === 'opis')
      setOpis(opis);
    else if (selectedType === 'ZahtevIzdavanje' && request === 'verifikacija') {

      try {

        const responseSlikaLica = await axios.get(`http://localhost:5212/ZahtevIzdavanje/GetImage/${row.kupac.id}`, {
          responseType: 'arraybuffer',
        });
        const responseSlikaUverenja = await axios.get(`http://localhost:5212/ZahtevIzdavanje/GetImageUverenje/${row.kupac.id}`);

        const blob = new Blob([responseSlikaLica.data], { type: 'image/png' }); 
        const imgUrl = URL.createObjectURL(blob);
        setSlikaLica(imgUrl);
        //setSlikaUverenja(responseSlikaUverenja.data);

        console.log(slikaLica);
        //console.log("Slika uverenja:", slikaUverenja);
      } catch (error) {
        console.error("Greska pri dobijanju slike lica korisnika",error);
      }
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleApproveClick = async () => {

    if (!selectedRow) return;

    const selectedRequest = filteredData(data).find(row => row.id === selectedRow);
  
    if (selectedRequest.status === "completed" || selectedRequest.status === "blocked" || selectedRequest.status === "readyForPayment") {
      console.log("Zahtev je već odobren, u stanju plaćanja ili je blokiran. Ne može se odobriti.");
      return;
    }

    try {

      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.KorisnikID;

      if(selectedType === 'ZahtevIzdavanje') {

        const response = await axios.put(`http://localhost:5212/Admin/ProcessRequestSwimmer/${selectedRequest.id}/${userID}/readyForPayment`);
        await fetchData(selectedType);
        
      } else if (selectedType === 'ZahtevPosao') {
        const response = await axios.put(`http://localhost:5212/Admin/ProcessRequestWorker/${selectedRequest.id}/${userID}/completed`);
        await fetchData(selectedType);
      }
    } catch (error) {
      console.error("Greška pri odobravanju zahteva", error);
    }
  };

  return (
    <ChakraProvider>
      <Box className="select-menu" p={4}>
        <select onChange={handleTypeChange} value={selectedType} style={{ marginBottom: '4px' }} className="select-request">
          <option value="ZahtevIzdavanje">Zahtev Izdavanje</option>
          <option value="ZahtevPosao">Zahtev Posao</option>
        </select>

        <select onChange={handleStatusChange} value={selectedStatus} style={{ marginBottom: '4px' }} className="select-request">
          <option value="Svi statusi">Svi statusi</option>
          <option value="Odobren">Odobren</option>
          <option value="Na čekanju">Na čekanju</option>
          {selectedType === 'ZahtevIzdavanje' &&
          <option value="Spreman za plaćanje">Spreman za plaćanje</option>}
          <option value="Odbijen">Odbijen</option>
        </select>

        <Button 
          width='150px' mr={4} ml={20}
          bg={theme === 'dark' ? '#32cd32' : 'green'} 
          color='white' 
          _hover={{ bg: theme === 'dark' ? '#28a828' : '#2e8b57' }}
          disabled={!selectedRow}
          cursor={!selectedRow ? 'not-allowed' : 'pointer'}
          onClick={handleApproveClick}
        >
          Odobri zahtev
        </Button>
        <Button 
          width='150px' mr={4}
          bg='red' 
          color='white' 
          _hover={{ bg: '#cc0000' }}
          disabled={!selectedRow}
          cursor={!selectedRow ? 'not-allowed' : 'pointer'}
        >
          Odbij zahtev
        </Button>

        <Modal isOpen={isDialogOpen} onClose={closeDialog}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Detalji zahteva</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <img src={slikaLica} alt="Slika lica korisnika" />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={closeDialog}>
                Zatvori
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <TableContainer marginTop={10}>
          <Table variant="striped">
            <Thead style={{ color: theme === 'dark' ? 'white' : 'black' }}>
              {selectedType === 'ZahtevIzdavanje' ? (
                <Tr>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>ID</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Tip karte</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Status</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>KID</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>AID</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black', textAlign: 'center', margin: 'auto', width: '50px' }}>Datum od</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Datum do</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Verifikacija zahteva</Th>
                </Tr>
              ) : (
                <Tr>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>ID</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Tip posla</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Status</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black', textAlign: 'center', margin: 'auto', width: '50px' }}>Opis</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>SRID</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>AID</Th>
                  <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Verifikacija zahteva</Th>
                </Tr>
              )}
            </Thead>
            <Tbody>
              {selectedType === 'ZahtevIzdavanje'
                ? filteredData(data).map((row, index) => (
                    <Tr 
                      key={row.id}
                      bg={theme === 'dark' ? '#333' : '#d6e2ff'} 
                      style={{ 
                        color: index % 2 === 0 ? (theme === 'dark' ? 'black' : 'black') : (theme === 'dark' ? 'white' : 'black'),
                        border: selectedRow === row.id ? '2px solid blue' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleRowClick(row)}
                    >
                      <Td border='none'>{row.id}</Td>
                      <Td border='none'>{row.tip_Karte}</Td>
                      <Td border='none'>{row.status}</Td>
                      <Td border='none'>{row.kupac && row.kupac.id ? row.kupac.id : ''}</Td>
                      <Td border='none'>{row.admin && row.admin.id ? row.admin.id : ''}</Td>
                      <Td border='none'>{row.datumOd}</Td>
                      <Td border='none'>{row.datumDo}</Td>
                      <Td border='none'>
                        <Button 
                          width='150px' 
                          bg={theme === 'dark' ? '#666' : '#b5bfe6'} 
                          color={theme === 'dark' ? 'white' : 'black'} 
                          _hover={{ bg: theme === 'dark' ? '#555' : '#a5afd6' }}
                          onClick={() => openDialog('verifikacija',row)}
                        >
                          Prikaži
                        </Button>
                      </Td>
                    </Tr>
                  ))
                : filteredData(data).map((row, index) => (
                    <Tr 
                      key={row.id}
                      bg={theme === 'dark' ? '#333' : '#d6e2ff'} 
                      style={{ 
                        color: index % 2 === 0 ? (theme === 'dark' ? 'black' : 'black') : (theme === 'dark' ? 'white' : 'black'),
                        border: selectedRow === row.id ? '2px solid blue' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleRowClick(row)}
                    >
                      <Td border='none'>{row.id}</Td>
                      <Td border='none'>{row.tip_Posla}</Td>
                      <Td border='none'>{row.status}</Td>
                      <Td border='none'>
                        <Button 
                          width='150px' 
                          bg={theme === 'dark' ? '#666' : '#b5bfe6'} 
                          color={theme === 'dark' ? 'white' : 'black'} 
                          _hover={{ bg: theme === 'dark' ? '#555' : '#a5afd6' }}
                          onClick={() => openDialog('opis',row)} 
                        >
                          Prikaži
                        </Button>
                      </Td>
                      <Td border='none'>{row.radnik && row.radnik.id ? row.radnik.id : ''}</Td>
                      <Td border='none'>{row.admin && row.admin.id ? row.admin.id : ''}</Td>
                      <Td border='none'>
                        <Button 
                          width='150px' 
                          bg={theme === 'dark' ? '#666' : '#b5bfe6'} 
                          color={theme === 'dark' ? 'white' : 'black'} 
                          _hover={{ bg: theme === 'dark' ? '#555' : '#a5afd6' }}
                          onClick={() => openDialog('verifikacija',row)}
                        >
                          Prikaži
                        </Button>
                      </Td>
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
