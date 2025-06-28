import '../styles/BookCard.css'; 
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect} from 'react';



function BookCard({ livro, onEdit, onDelete }) {
  const defaultCover = 'https://picsum.photos/120/180?grayscale&text=Sem+Capa'; // Imagem padrão
  const [decoded, setDecoded] = useState();
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token){
      const decoded = jwtDecode(token);
      setDecoded(decoded)
    }
  },[]);

  
  

  
  const capaUrl = livro.caminhoCapa
    ? `http://localhost:8080/api/livro/capa/${encodeURIComponent(livro.titulo)}` 
    : defaultCover;

  const handleImageError = (e) => {
    e.target.onerror = null; 
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
            href={`http://localhost:8080/api/livro/download/${encodeURIComponent(livro.titulo)}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="book-card-pdf-link"
          >
            Baixar PDF ({livro.caminhoArquivo})
          </a>
        )}
      </div>
      { decoded && decoded.role === "ROLE_ADMIN" && (
        <div className="book-card-actions">
          <button onClick={() => onEdit(livro.id)} className="book-card-button edit">
            Editar
          </button>
          <button onClick={() => onDelete(livro.id, livro.titulo)} className="book-card-button delete">
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}

export default BookCard;