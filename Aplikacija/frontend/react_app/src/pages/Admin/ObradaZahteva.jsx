import React from 'react'
import RequestsTable from '../../components/RequestsTable/RequestsTable'

export const ObradaZahteva = ({theme}) => {
  return (
    <div className='table-content'>
      <RequestsTable theme={theme} />
    </div>
  )
}
