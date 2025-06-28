import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css'; // O CSS que vamos criar abaixo

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThLarge, faBook, faPlus, faUser, faSignOutAlt, faChevronLeft, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ decoded }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`sidebar-avancada ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <span className="logo">📚</span>
          <h3 className="sidebar-title">Biblioteca</h3>
        </div>
        <button className="toggle-btn" onClick={handleToggleSidebar}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-link">
          <FontAwesomeIcon icon={faThLarge} className="nav-icon" />
          <span className="link-text">Dashboard</span>
        </NavLink>
        <NavLink to="/lista-livros" className="nav-link">
          <FontAwesomeIcon icon={faBook} className="nav-icon" />
          <span className="link-text">Meus Livros</span>
        </NavLink>
        {decoded && decoded.role === "ROLE_ADMIN" && (
          <NavLink to="/cadastro-livros" className="nav-link">
            <FontAwesomeIcon icon={faPlus} className="nav-icon" />
            <span className="link-text">Cadastrar Livro</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/perfil" className="nav-link">
          <FontAwesomeIcon icon={faUser} className="nav-icon" />
          <span className="link-text">Meu Perfil</span>
        </NavLink>
        <NavLink to="/" className="nav-link">
          <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
          <span className="link-text">Sair</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;