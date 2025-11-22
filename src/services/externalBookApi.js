// src/services/externalBookApi.js
import axios from 'axios';

const externalApi = axios.create({
  baseURL: 'http://localhost:8080', // <<< REMOVE o /api/busca-externa daqui
  timeout: 30000,
});

export const buscarLivrosExternos = async (query, limite = 5) => {
  try {
    const response = await externalApi.get('/api/busca-externa', {
      params: { q: query, limite }
    });

    console.log("=== RESPONSE RAW ===", response.data);

    // GAMBIARRA TEMPORÁRIA: Se vier "docs" em vez de "livros"
    if (response.data.docs && !response.data.livros) {
      return {
        totalEncontrados: response.data.numFound,
        livros: response.data.docs
      };
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar livros externos:', error);
    throw error;
  }
};


export default externalApi;
