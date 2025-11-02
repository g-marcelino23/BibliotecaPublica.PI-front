import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as AutorService from '../services/AutorService';
import * as LivroService from '../services/LivroService'; // <--- Agora este import funciona
import Loading from '../components/Loading'; // Supondo que você tenha um
import '../styles/AutorDetailPage.css'; 
import BookCard from './BookCard'; // Se você tiver um componente de card

function AutorDetailPage() {
  const { id } = useParams(); // Pega o ID da URL
  const [autor, setAutor] = useState(null);
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efeito para buscar o AUTOR
  useEffect(() => {
    const fetchAutor = async () => {
      try {
        setLoading(true);
        const response = await AutorService.getAutorById(id);
        setAutor(response.data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar o autor.');
        console.error(err);
        setLoading(false);
      }
    };
    fetchAutor();
  }, [id]);

  // Efeito para buscar os LIVROS (só roda DEPOIS que o autor for encontrado)
  useEffect(() => {
    if (autor) {
      const fetchLivros = async () => {
        try {
          // Usa o NOME do autor para buscar os livros
          const response = await LivroService.getLivrosPorAutorNome(autor.nome);
          setLivros(response.data);
        } catch (err) {
          console.error("Erro ao buscar livros do autor:", err);
          setError('Erro ao buscar os livros deste autor.');
        } finally {
          setLoading(false); // Termina o loading aqui
        }
      };
      fetchLivros();
    }
  }, [autor]); // Depende do 'autor'

  if (loading) {
    return <Loading />;
  }

  if (error || !autor) {
    return <p style={{ color: 'red' }}>{error || 'Autor não encontrado.'}</p>;
  }

  return (
    <div className="autor-detail-container">
      <div className="autor-header">
        <img
          src={AutorService.getCapaAutorUrl(autor.nome)}
          alt={autor.nome}
          className="autor-detail-capa"
          style={{ width: '150px', height: '220px', objectFit: 'cover' }} // Estilo de exemplo
        />
        <div className="autor-info">
          <h1>{autor.nome}</h1>
          <h3>Biografia</h3>
          <p>{autor.biografia}</p>
        </div>
      </div>

      <div className="livros-do-autor">
        <h2>Livros de {autor.nome}</h2>
        <div className="livros-grid"> {/* Use o mesmo grid dos seus livros */}
          {livros.length > 0 ? (
            livros.map(livro => (
              // Se você tem um componente <BookCard>, use-o:
              // <BookCard key={livro.id} livro={livro} />
              
              // --- CÓDIGO DA CAPA AGORA FUNCIONA ---
              <Link to={`/lista-livros`} key={livro.id} className="book-card-simple">
                 <img 
                   src={LivroService.getCapaLivroUrl(livro.titulo)} 
                   alt={livro.titulo} 
                   style={{ width: '100px', height: '150px', objectFit: 'cover' }} // Estilo de exemplo
                 />
                 <p>{livro.titulo}</p>
              </Link>
            ))
          ) : (
            <p>Nenhum livro encontrado para este autor.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AutorDetailPage;