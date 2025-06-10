import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { FaSearch, FaDownload, FaSun, FaMoon } from 'react-icons/fa';
import jwtDecodefrom, { jwtDecode } from 'jwt-decode';
import capa1 from '../assets/capas/capa1.jpg';
import capa2 from '../assets/capas/capa2.jpg';
import capa3 from '../assets/capas/capa3.jpg';
import destaque from '../assets/destaques/destaque.gif';
import destaque3 from '../assets/destaques/destaque3.jpg';
import destaque2 from '../assets/destaques/destaque2.gif';
import destaque1 from '../assets/destaques/destaque1.jpg';
import capa4 from '../assets/capas/capa4.jpg';
import capa5 from '../assets/capas/capa5.jpg';
import capa6 from '../assets/capas/capa6.jpg';
import capa7 from '../assets/capas/capa7.jpg';
import capa8 from '../assets/capas/capa8.jpg';
import capa9 from '../assets/capas/capa9.jpg';
import capa10 from '../assets/capas/capa10.jpg';
import capa11 from '../assets/capas/capa11.jpg';  
import capa12 from '../assets/capas/capa12.jpg';
import capa13 from '../assets/capas/capa13.jpg';
import capa14 from '../assets/capas/capa14.jpg';

const DashboardBiblioteca = () => {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [decoded, setDecoded] = useState()
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (token){
      const decoded = jwtDecode(token);
      setDecoded(decoded)
    }

    const nome = localStorage.getItem('userName') || 'Usuário';
    setNomeUsuario(nome);

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, [navigate]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const livros = [
    { id: 1, titulo: 'Os Miseráveis', autor: 'Victor Hugo', imagem: capa1, pdfUrl: '/pdfs/os_miseraveis.pdf'},
    { id: 2, titulo: 'O Hobbit', autor: 'J.R.R. Tolken', imagem: capa2, pdfUrl: '/pdfs/o_hobbit.pdf'},
    { id: 3, titulo: 'A Revolução dos Bichos', autor: 'George Orwell', imagem: capa3, pdfUrl: '/pdfs/revolucao_dos_bichos.pdf'},
    { id: 4, titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', imagem: capa4, pdfUrl: '/pdfs/senhor_dos_aneis.pdf'},
    { id: 5, titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', imagem: capa5, pdfUrl: '/pdfs/pequeno_principe.pdf'},
    { id: 6, titulo: 'O Código Da Vinci', autor: 'Dan Brown', imagem: capa6, pdfUrl: '/pdfs/codigo_da_vinci.pdf'},
    { id: 7, titulo: 'Cem Anos de Solidão', autor: 'Gabriel García Márquez', imagem: capa7, pdfUrl: '/pdfs/cem_anos_de_solidão.pdf'},
    { id: 8, titulo: 'Doutor Sono', autor: 'Stephen King', imagem: capa8, pdfUrl: '/pdfs/doutor_sono.pdf'},
    { id: 9, titulo: 'O Iluminado', autor: 'Stephen King', imagem: capa9, pdfUrl: '/pdfs/o_iluminado.pdf'},
    { id: 10, titulo: 'A Menina que Roubava Livros', autor: 'Markus Zusak', imagem: capa10, pdfUrl: '/pdfs/menina_que_roubava_livros.pdf'},
    { id: 11, titulo: 'O Nome do Vento', autor: 'Patrick Rothfuss', imagem: capa11, pdfUrl: '/pdfs/nome_do_vento.pdf'},
    { id: 12, titulo: 'Orgulho e Preconceito', autor: 'Jane Austen', imagem: capa12, pdfUrl: '/pdfs/orgulho_e_preconceito.pdf'},
    { id: 13, titulo: 'Drácula', autor: 'Bram Stoker', imagem: capa13, pdfUrl: '/pdfs/dracula.pdf'},
    { id: 14, titulo: 'Frankenstein', autor: 'Mary Shelley', imagem: capa14, pdfUrl: '/pdfs/frankenstein.pdf'},
  ];

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Dark mode toggle */}
      <div className="dark-mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
      </div>

      {/* Sidebar */}
      <div className="sidebar-modern glass-effect p-4">
        <h4 className="sidebar-title">📚 Biblioteca Pública</h4>
        <ul className="nav flex-column gap-3 mt-4">
          <li><Link to="/lista-livros" className="nav-link text-dark fw-semibold">📖 Visualizar Livros</Link></li>
          { decoded && decoded.role === "ROLE_ADMIN" && 
              (<li><Link to="/cadastro-livros" className="nav-link text-dark fw-semibold">➕ Cadastrar Livro</Link></li>)
          }
          <li><Link to="/perfil" className="nav-link text-dark fw-semibold">👤 Meu Perfil</Link></li>
          <li><Link to="/" className="nav-link text-dark fw-semibold">🚪 Sair</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content p-4">
        <header className="dashboard-header d-flex justify-content-between align-items-center mb-4">
          <h2>Olá, {nomeUsuario}!</h2>
        </header>

        {/* Search */}
        <div className="filters d-flex gap-3 mb-4 align-items-center">
          <div className="input-group w-50">
            <input type="text" className="form-control" placeholder="Search books..." />
            <span className="input-group-text"><FaSearch /></span>
          </div>
        </div>

        {/* Destaques */}
        <section className="destaques-container mb-4">
          <h4 className="mb-3">Destaques</h4>
          <div className="destaques-boxes">
            <div className="destaque-card" style={{ backgroundImage: `url(${destaque})` }}>
              <div className="overlay" />
              <img src={destaque3} alt="Miniatura" className="mini-capa" />
              <div className="info">
                <h5>O Pequeno Príncipe</h5>
                <p>Antoine de Saint-Exupéry</p>
              </div>
            </div>
            <div className="destaque-card" style={{ backgroundImage: `url(${destaque2})` }}>
              <div className="overlay" />
              <img src={destaque1} alt="Miniatura" className="mini-capa" />
              <div className="info">
                <h5>Alice no País das Maravilhas</h5>
                <p>Lewis Carroll</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recomendações */}
        <section className="book-recommendations">
          <h4 className="mb-3">Recomendações de Livros</h4>
          <div className="livros-grid">
            {livros.map((livro) => (
              <div key={livro.id} className="livro-card">
                <div className="card-inner">
                  <div className="card-front">
                    <img src={livro.imagem} alt={livro.titulo} className="livro-capa" />
                  </div>
                  <div className="card-back">
                    <h5>{livro.titulo}</h5>
                    <p>{livro.autor}</p>
                    <a
                      href={livro.pdfUrl}
                      download
                      className="download-icon"
                      title={`Baixar ${livro.titulo}`}
                    >
                      <FaDownload size={24} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardBiblioteca;
