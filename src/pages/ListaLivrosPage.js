// src/components/ListaLivrosPage.js
import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import BookCard from './BookCard'; // Importe o novo componente
import { useNavigate } from 'react-router-dom';
import '../styles/BookCard.css'; // Importe o CSS para o container da lista
import { FaSearch } from 'react-icons/fa';

function ListaLivrosPage() {
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ message: '', type: '' }); // Para feedback de exclusão
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const getLivros = async () => {
      if (!token) {
        setFeedback({ message: "Token de autenticação não encontrado. Faça login.", type: "error" });
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get("/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLivros(response.data);
        setFeedback({ message: '', type: '' });
      } catch (err) {
        console.error("Erro ao buscar livros:", err);
        setFeedback({ message: "Falha ao carregar a lista de livros.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    getLivros();
  }, [token]);

  const handleEditBook = (livroId) => {
    if (livroId) {
      navigate(`/editar/${livroId}`);
    } else {
      console.error("ID do livro não encontrado para edição.");
    }
  };

  const handleDeleteBook = async (livroId, livroTitulo) => {
    if (!livroId) {
      alert("ID do livro não encontrado para exclusão.");
      return;
    }
    if (window.confirm(`Tem certeza que deseja excluir o livro "${livroTitulo}"?`)) {
      if (!token) {
        setFeedback({ message: "Operação não permitida. Faça login.", type: "error" });
        return;
      }
      try {
        await api.delete(`/deletar/${livroId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLivros(prevLivros => prevLivros.filter(livro => livro.id !== livroId));
        setFeedback({ message: `Livro "${livroTitulo}" excluído com sucesso!`, type: 'success' });
      } catch (error) {
        console.error("Erro ao excluir livro:", error);
        setFeedback({ message: "Erro ao excluir livro.", type: 'error' });
      }
    }
  };

  const livrosFiltrados = livros.filter((livro) => (
    livro.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    livro.autor.toLowerCase().includes(busca.toLowerCase())
  ));

  if (loading) return <p>Carregando livros...</p>;
  
  return (
    <div>
      <h2 className='text-center mt-4 mb-4 '>Nossa Coleção de Livros</h2>
      {feedback.message && (
        <p style={{ color: feedback.type === 'error' ? 'red' : 'green', textAlign: 'center' }}>
          {feedback.message}
        </p>
      )}
      
      <div className="filters d-flex justify-content-center align-items-center gap-3 mb-4">
        <div className="input-group w-50">
          <input 
            type="text" 
            className="form-control" 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar livros por título ou autor..." 
          />
          <span className="input-group-text"><FaSearch /></span>
        </div>
      </div>

      {livros.length > 0 ? (
        <div className="book-list-container"> {/* Container para o layout flex/grid */}
          {livrosFiltrados.map(livro => (
            <BookCard
              key={livro.id}
              livro={livro}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
            />
          ))}
        </div>
      ) : (
        !loading && <p className='text-center mt-4'>Nenhum livro cadastrado.</p>
      )}
    </div>
  );
}

export default ListaLivrosPage;