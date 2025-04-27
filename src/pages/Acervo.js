import React from 'react';
import '../styles/Acervo.css';
import capa1 from '../assets/capas/capa1.jpg';
import capa2 from '../assets/capas/capa2.jpg';
import capa3 from '../assets/capas/capa3.jpg';
// adicione quantas quiser

function Acervo() {
  const livros = [
    { id: 1, titulo: 'Livro 1', imagem: capa1 },
    { id: 2, titulo: 'Livro 2', imagem: capa2 },
    { id: 3, titulo: 'Livro 3', imagem: capa3 },
  ];

  return (
    <div className="acervo-container">
      <h2 className="acervo-titulo">VEJA ALGUNS LIVROS DISPONÍVEIS</h2>
      <div className="livros-grid">
        {livros.map((livro) => (
          <div key={livro.id} className="livro-card">
            <img src={livro.imagem} alt={livro.titulo} className="livro-capa" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Acervo;
