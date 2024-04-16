import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Home,Login,Register,About} from './pages'

const App = () => {

  const current_theme = localStorage.getItem('current_theme');
  const[theme , setTheme] = useState(current_theme ? current_theme: 'light');

  useEffect(() => {
      localStorage.setItem('current_theme', theme);
  },[theme])

  return (
    <div className={`container ${theme}`}>
      <BrowserRouter>
        <Navbar theme={theme} setTheme={setTheme} />
        <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/about' element={<About />}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App