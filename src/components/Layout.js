// src/components/Layout.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Sidebar from './Sidebar';
import { FaSun, FaMoon } from 'react-icons/fa';
import '../styles/Layout.css'; // Um novo CSS para o layout

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [decoded, setDecoded] = useState(null);
  const navigate = useNavigate();

  // Lógica de autenticação e tema que estava na Dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decodedToken = jwtDecode(token);
      setDecoded(decodedToken);
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      localStorage.removeItem('token'); // Limpa token inválido
      navigate('/login');
    }

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, [navigate]);

  // Aplica a classe dark-mode no body para o tema funcionar globalmente
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  return (
    <div className={`layout-container ${darkMode ? 'dark-mode' : ''}`}>
      <Sidebar decoded={decoded} />

      <div className="main-content-area">
        <div className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
        </div>
        
        {/* 'children' é onde o conteúdo da sua página (ex: Dashboard) será renderizado */}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;