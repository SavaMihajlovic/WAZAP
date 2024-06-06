import React, { useState, useEffect } from 'react';
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr, Button, Box, ChakraProvider } from '@chakra-ui/react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './AdminPanelTable.css'

const AdminPanelTable = ({ theme }) => {
  const [selectedType, setSelectedType] = useState('Svi korisnici');
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleTypeChange = async (e) => {
    const type = e.target.value;
    setSelectedType(type);
    await fetchData(type);
  };

  const fetchData = async (type) => {
    try {
      let response;
      if (type === 'Svi korisnici') {
        response = await axios.get('http://localhost:5212/Admin/GetAllUsers');
      } else {
        response = await axios.get(`http://localhost:5212/Admin/GetUsers/${type}`);
      }
      setData(response.data);
    } catch (error) {
      console.error('Greška pri prikupljanju podataka', error);
    }
  };

  useEffect(() => {
    fetchData(selectedType);
  }, [selectedType]);

  const handleRowClick = (row) => {
    setSelectedRow(row.id === selectedRow ? null : row.id);
  };

  const handlePromoteClick = async () => {

    if (!selectedRow || (selectedRow && data.find(user => user.id === selectedRow).tipKorisnika === "Admin"))
        return;

    try {
      await axios.put(`http://localhost:5212/Admin/PromoteToAdmin/${selectedRow}`);
      await fetchData(selectedType);
    } catch (error) {
      console.error('Greška pri unapređivanju korisnika', error);
    }
  };

  const handleRemoveClick = async () => {
    if (!selectedRow) return;

    try {
      await axios.delete(`http://localhost:5212/Admin/DeleteUser/${selectedRow}`);
      await fetchData(selectedType);
    } catch (error) {
      console.error('Greška pri uklanjanju korisnika', error);
    }
  };

  return (
    <ChakraProvider>
      <Box style={{ display: 'flex', flexDirection: 'column' }}>
        <Box className="select-menu" p={4} style={{ display: 'flex', flexWrap: 'wrap' }}>
          <select onChange={handleTypeChange} value={selectedType} style={{ marginBottom: '4px' }} className="select-user">
            <option value="Svi korisnici">Svi korisnici</option>
            <option value="Kupac">Kupači</option>
            <option value="Radnik">Radnici</option>
            <option value="Admin">Admini</option>
          </select>
        </Box>

        <TableContainer marginTop={5} p={4}>
          <Table variant="striped">
            <Thead style={{ color: theme === 'dark' ? 'white' : 'black' }}>
              <Tr>
                <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>ID</Th>
                <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Ime</Th>
                <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Prezime</Th>
                <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Korisničko ime</Th>
                <Th style={{ color: theme === 'dark' ? 'white' : 'black' }}>Tip korisnika</Th>
                <Th style={{ color: theme === 'dark' ? 'white' : 'black', textAlign: 'center', margin: 'auto', width: '50px' }}>Unapredi korisnika</Th>
                <Th style={{ color: theme === 'dark' ? 'white' : 'black', textAlign: 'center', margin: 'auto', width: '50px' }}>Ukloni korisnika</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((row, index) => (
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
                  <Td border='none'>{row.ime}</Td>
                  <Td border='none'>{row.prezime}</Td>
                  <Td border='none'>{row.korisnickoIme}</Td>
                  <Td border='none'>{row.tipKorisnika}</Td>
                  <Td>
                  <Button
                    width='150px' mr={4}
                    bg={theme === 'dark' ? '#666' : '#b5bfe6'} 
                    color={theme === 'dark' ? 'white' : 'black'} 
                    _hover={{ bg: theme === 'dark' ? '#555' : '#a5afd6' }}
                    disabled={!selectedRow || (selectedRow && data.find(user => user.id === selectedRow).tipKorisnika === "Admin")}
                    cursor={!selectedRow || (selectedRow && data.find(user => user.id === selectedRow).tipKorisnika === "Admin") ? 'not-allowed' : 'pointer'}
                    onClick={handlePromoteClick}
                    >
                    Unapredi
                  </Button>
                  </Td>
                  <Td>
                  <Button
                    width='150px' mr={4}
                    bg={theme === 'dark' ? '#666' : '#b5bfe6'} 
                    color={theme === 'dark' ? 'white' : 'black'} 
                    _hover={{ bg: theme === 'dark' ? '#555' : '#a5afd6' }}
                    disabled={!selectedRow}
                    cursor={!selectedRow ? 'not-allowed' : 'pointer'}
                    onClick={handleRemoveClick}
                    >
                    Ukloni
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
};

export default AdminPanelTable;
