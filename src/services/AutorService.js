// src/services/AutorService.js
import api from './api'; // Importa a instância do axios JÁ CONFIGURADA com o token

const BASE_URL = '/api/autor';

/**
 * Busca todos os autores.
 */
export const getAutores = () => {
  return api.get(BASE_URL);
};

/**
 * Cadastra um novo autor.
 * @param {FormData} formData - Deve conter 'nome', 'biografia' e 'capa'
 */
export const createAutor = (formData) => {
  // O interceptor no api.js vai cuidar do Header de 'multipart/form-data'
  return api.post(BASE_URL, formData);
};

/**
 * Deleta um autor pelo ID.
 */
export const deleteAutor = (id) => {
  return api.delete(`${BASE_URL}/${id}`);
};

/**
 * URL pública para a capa do autor.
 */
export const getCapaAutorUrl = (nomeAutor) => {
  // O backend liberou /api/autor/capa/** publicamente
  return `http://localhost:8080/api/autor/capa/${encodeURIComponent(nomeAutor)}`;
};

/**
 * Busca um autor específico pelo ID.
 */
export const getAutorById = (id) => {
  return api.get(`${BASE_URL}/${id}`);
};