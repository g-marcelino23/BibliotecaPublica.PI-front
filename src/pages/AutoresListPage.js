import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as AutorService from '../services/AutorService';
import Loading from '../components/Loading'; // Supondo que você tenha um

 import '../styles/AutoresListPage.css'; 

function AutoresListPage() {
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarAutores = async () => {
      try {
        setLoading(true);
        // Busca todos os autores (precisa de token)
        const response = await AutorService.getAutores();
        setAutores(response.data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar autores.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarAutores();
  }, []);

  if (loading) {
    return <Loading />; // Ou <p>Carregando...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="autores-list-container">
      <h2>Catálogo de Autores</h2>
      <div className="autores-grid"> {/* Use CSS para fazer um grid */}
        {autores.map(autor => (
          <Link to={`/autores/${autor.id}`} key={autor.id} className="autor-card">
            <img
              src={AutorService.getCapaAutorUrl(autor.nome)}
              alt={autor.nome}
            />
            <h3>{autor.nome}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AutoresListPage;