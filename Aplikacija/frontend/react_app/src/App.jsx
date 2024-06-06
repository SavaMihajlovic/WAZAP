import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Login, Register, About, ForgotPassword, ResetPassword,
         HomeKupac, KupovinaKarata, RezervisanjeLezaljki,
         HomeRadnik, ZahtevZaPosao,
         HomeAdmin, ObradaZahteva, AdminPanel,
         PaymentSuccess, PaymentFailure} from './pages';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import PrivateRoutes from './utils/PrivateRoutes';

const App = () => {
  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`container ${theme}`}>
      <BrowserRouter>
        <Navbar theme={theme} setTheme={setTheme} />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About theme={theme} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<Navigate to="/" />} />
            <Route path="/reset-password/:email/:token" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />

            {/* Rute sa privilegijama pristupa */}
            <Route element={<PrivateRoutes role='Kupac'/>}>
              <Route path="/kupac" element={<HomeKupac theme={theme} />} />
              <Route path="/kupac-kupovina-karata" element={<KupovinaKarata />} />
              <Route path="/kupac-rezervisanje-lezaljki" element={<RezervisanjeLezaljki />} />
            </Route>

            <Route element={<PrivateRoutes role='Radnik'/>}>
              <Route path="/radnik" element={<HomeRadnik theme={theme} />} />
              <Route path="/radnik-zahtev-za-posao" element={<ZahtevZaPosao />} />
            </Route>

            <Route element={<PrivateRoutes role='Admin'/>}>
              <Route path="/administrator" element={<HomeAdmin theme={theme} />} />
              <Route path="/administrator-obrada-zahteva" element={<ObradaZahteva theme={theme} />} />
              <Route path="/administrator-admin-panel" element={<AdminPanel theme={theme} />} />
            </Route>

            {/*Navigacije*/}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/404" />} />
            <Route path="/logout" element={<Navigate to="/"/> }/>
          </Routes>
          {/*<Footer theme={theme} />*/}
        </div>
      </BrowserRouter>
      {loading && <div className="loading-container"><LoadingSpinner /></div>}
    </div>
  );
};

export default App;