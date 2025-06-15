// src/pages/DashboardBiblioteca.js (VERSÃO FINAL)

import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css'; 
import AutoresCarousel from '../components/AutoresCarousel'; // 1. Importa o novo componente

const DashboardBiblioteca = () => {
  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => {
    const nome = localStorage.getItem('userName') || 'Usuário';
    setNomeUsuario(nome);
  }, []);

  return (
    // O React.Fragment <> continua sendo uma boa prática aqui
    <>
      <header className="dashboard-header d-flex justify-content-between align-items-center mb-4">
        <h2>Olá, {nomeUsuario}!</h2>
      </header>
      
      {/* 2. Aqui, o carrossel substitui o placeholder antigo */}
      <AutoresCarousel />
      
    </>
  );
};

export default DashboardBiblioteca;