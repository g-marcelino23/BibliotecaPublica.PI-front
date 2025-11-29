// src/components/Layout.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Sidebar from './Sidebar';
import FloatingAssistantButton from './FloatingAssistantButton';
import AssistantPanel from './AssistantPanel';
import { FaSun, FaMoon } from 'react-icons/fa';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [decoded, setDecoded] = useState(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const navigate = useNavigate();

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
      localStorage.removeItem('token');
      navigate('/login');
    }

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, [navigate]);

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

        <div className="page-content">
          {children}
        </div>
      </div>

      <FloatingAssistantButton 
        onClick={() => setAssistantOpen(true)} 
        isOpen={assistantOpen} 
      />
      <AssistantPanel 
        open={assistantOpen} 
        onClose={() => setAssistantOpen(false)} 
      />
    </div>
  );
};

export default Layout;
