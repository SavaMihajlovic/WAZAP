import React from 'react'
import AdminPanelTable from '../../components/AdminPanelTable/AdminPanelTable'


export const AdminPanel = ({theme}) => {
  return (
    <div className='admin-panel-content'>
      <AdminPanelTable theme={theme} />
    </div>
  )
}
