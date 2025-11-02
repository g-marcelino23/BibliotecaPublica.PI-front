import api from './api'; // Importa a instância do axios com token

/**
 * Busca livros pelo NOME do autor.
 * (Usado na página de Detalhes do Autor)
 */
export const getLivrosPorAutorNome = (nomeAutor) => {
  // Chama GET /api/livro/{nomeAutor}
  return api.get(`/api/livro/${encodeURIComponent(nomeAutor)}`);
};

/**
 * Retorna a URL pública para a capa do livro.
 * (Usado na página de Detalhes do Autor)
 */
export const getCapaLivroUrl = (tituloLivro) => {
  // Chama GET /api/livro/capa/{titulo}
  return `http://localhost:8080/api/livro/capa/${encodeURIComponent(tituloLivro)}`;
};

/**
 * Busca todos os livros permitidos (baseado na idade).
 */
export const getLivrosPermitidos = () => {
    // Chama GET /api/livro/permitidos
    return api.get('/api/livro/permitidos');
};

/**
 * Busca um livro pelo ID.
 */
export const getLivroById = (id) => {
    // Chama GET /api/livro/byId/{id}
    return api.get(`/api/livro/byId/${id}`);
};

// (Adicione aqui seus outros métodos de livro, como create, update, delete)