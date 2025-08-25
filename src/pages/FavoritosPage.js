// Local: src/components/FavoritosPage.js

import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import BookCard from './BookCard.js';
import Loading from '../components/Loading.js';
import '../styles/BookCard.css';

function FavoritosPage() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchFavoritos = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get('/favoritos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavoritos(response.data);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoritos();
  }, [token]);

  const handleRemoveFavorito = async (livroId) => {
    setFavoritos(prevFavoritos => prevFavoritos.filter(livro => livro.id !== livroId));

    try {
      // --- CORREÇÃO APLICADA AQUI ---
      // Removido o "/api/" do início para não duplicar a URL
      await api.delete(`/favoritos/${livroId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      alert("Não foi possível remover o favorito. A página será recarregada.");
      fetchFavoritos();
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h2 className='text-center mt-4 mb-4'>Meus Livros Favoritos</h2>
      {favoritos.length > 0 ? (
        <div className="book-list-container">
          {favoritos.map(livro => (
            <BookCard
              key={livro.id}
              livro={livro}
              isFavorito={true}
              onToggleFavorito={handleRemoveFavorito}
            />
          ))}
        </div>
      ) : (
        <p className='text-center mt-4'>Você ainda não adicionou nenhum livro aos favoritos.</p>
      )}
    </div>
  );
}

export default FavoritosPage;