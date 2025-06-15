
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css'; 

const Sidebar = ({ decoded }) => {
  return (
    <div className="sidebar-modern glass-effect p-4">
      <h4 className="sidebar-title">📚 Biblioteca Pública</h4>
      <ul className="nav flex-column gap-3 mt-4">
        <li><Link to="/lista-livros" className="nav-link">📖 Visualizar Livros</Link></li>
        {decoded && decoded.role === "ROLE_ADMIN" && (
          <li><Link to="/cadastro-livros" className="nav-link">➕ Cadastrar Livro</Link></li>
        )}
        <li><Link to="/perfil" className="nav-link">👤 Meu Perfil</Link></li>
        <li><Link to="/" className="nav-link">🚪 Sair</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;