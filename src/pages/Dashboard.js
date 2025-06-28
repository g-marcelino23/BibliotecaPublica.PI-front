// src/pages/DashboardBiblioteca.js

import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css'; 
import AutorSlider from '../components/AutorSlider'; // 1. Importa o novo componente

const DashboardBiblioteca = () => {
  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => {
    const nome = localStorage.getItem('userName') || 'Usuário';
    setNomeUsuario(nome);
  }, []);

  return (
    <>
      <header className="dashboard-header d-flex justify-content-between align-items-center mb-4">
        <h2>Olá, {nomeUsuario}!</h2>
      </header>
      
      {/* 2. Usa o novo slider no lugar do componente de livro */}
      <AutorSlider />
      
    </>
  );
};

export default DashboardBiblioteca;