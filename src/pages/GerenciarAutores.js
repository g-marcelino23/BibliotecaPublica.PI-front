import React, { useState, useEffect } from 'react';
import * as AutorService from '../services/AutorService'; // Importa o novo serviço
import '../styles/GerenciarAutores.css'; 

function GerenciarAutores() {
  const [autores, setAutores] = useState([]);
  
  // Estados para o formulário
  const [nome, setNome] = useState('');
  const [biografia, setBiografia] = useState('');
  const [capaFile, setCapaFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para carregar a lista de autores
  const carregarAutores = async () => {
    setLoading(true);
    try {
      const response = await AutorService.getAutores();
      setAutores(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar autores. Verifique se você é Admin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os autores quando o componente é montado
  useEffect(() => {
    carregarAutores();
  }, []);

  // Função para lidar com o submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !biografia || !capaFile) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('biografia', biografia);
    formData.append('capa', capaFile);

    setLoading(true);
    setError(null); // Limpa erros antigos
    try {
      await AutorService.createAutor(formData);
      // Limpa o formulário e recarrega a lista
      setNome('');
      setBiografia('');
      setCapaFile(null);
      e.target.reset(); // Limpa o input de arquivo
      await carregarAutores(); // Espera recarregar
    } catch (err) {
      setError('Erro ao salvar autor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- INÍCIO DA CORREÇÃO ---
  // Função para deletar um autor
  const handleDelete = async (autorId) => {
    if (window.confirm('Tem certeza que deseja deletar este autor?')) {
      setLoading(true);
      setError(null); // Limpa erros antigos
      try {
        // 1. Manda o comando de delete para o backend
        await AutorService.deleteAutor(autorId);

        // 2. SUCESSO! Remove o autor da lista local (estado)
        // Isso é mais rápido do que chamar carregarAutores()
        setAutores(autoresAtuais =>
          autoresAtuais.filter(autor => autor.id !== autorId)
        );

      } catch (err) {
        // 3. Se o delete REALMENTE falhar (ex: 500)
        setError('Erro ao deletar autor. Tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };
  // --- FIM DA CORREÇÃO ---

  return (
    <div className="gerenciar-autores-container"> {/* Adicione estilos CSS */}
      <h2>Gerenciamento de Autores</h2>

      {/* Formulário de Cadastro */}
      <form onSubmit={handleSubmit} className="autor-form">
        <h3>Cadastrar Novo Autor</h3>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Biografia:</label>
          <textarea
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Capa (Imagem):</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => setCapaFile(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Autor'}
        </button>
      </form>

      {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}

      {/* Lista de Autores Cadastrados */}
      <div className="lista-autores">
        <h3>Autores Cadastrados</h3>
        {loading && autores.length === 0 && <p>Carregando...</p>}
        <ul>
          {autores.map((autor) => (
            <li key={autor.id}>
              <img
                src={AutorService.getCapaAutorUrl(autor.nome)}
                alt={`Capa de ${autor.nome}`}
                width="50"
                height="70"
                style={{objectFit: 'cover'}}
              />
              <span>{autor.nome}</span>
              <button onClick={() => handleDelete(autor.id)} disabled={loading}>
                Deletar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GerenciarAutores;