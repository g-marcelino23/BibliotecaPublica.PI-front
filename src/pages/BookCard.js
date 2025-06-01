// src/components/BookCard.js
import React from 'react';
import '../styles/BookCard.css'; // Vamos criar este arquivo CSS

function BookCard({ livro, onEdit, onDelete }) {
  const defaultCover = 'https://via.placeholder.com/120x180.png?text=Sem+Capa'; // Imagem padrão

  // Constrói a URL da capa corretamente
  const capaUrl = livro.caminhoCapa
    ? `http://localhost:8080/api/livro/capa/${encodeURIComponent(livro.titulo)}` // Ou use livro.caminhoCapa se for o nome do arquivo
    : defaultCover;

  const handleImageError = (e) => {
    e.target.onerror = null; // Previne loop infinito se a imagem padrão também falhar
    e.target.src = defaultCover;
  };

  return (
    <div className="book-card">
      <img 
        src={capaUrl} 
        alt={`Capa de ${livro.titulo}`} 
        className="book-card-cover"
        onError={handleImageError}
      />
      <div className="book-card-info">
        <h3 className="book-card-title">{livro.titulo}</h3>
        <p className="book-card-author">Por: {livro.autor}</p>
        <p className="book-card-description">{livro.descricao || "Sem descrição."}</p>
        {livro.caminhoArquivo && (
          <a
            href={`http://localhost:8080/api/livro/download/${encodeURIComponent(livro.titulo)}`} // Ou use o ID/caminhoArquivo
            target="_blank"
            rel="noopener noreferrer"
            className="book-card-pdf-link"
          >
            Baixar PDF ({livro.caminhoArquivo})
          </a>
        )}
      </div>
      <div className="book-card-actions">
        <button onClick={() => onEdit(livro.id)} className="book-card-button edit">
          Editar
        </button>
        <button onClick={() => onDelete(livro.id, livro.titulo)} className="book-card-button delete">
          Excluir
        </button>
      </div>
    </div>
  );
}

export default BookCard;