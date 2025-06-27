import axios from 'axios';

const apiUsuario = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
});

// Adiciona o token automaticamente em cada requisição
apiUsuario.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiUsuario;
