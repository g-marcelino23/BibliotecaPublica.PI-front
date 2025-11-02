// src/services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080', 
});

api.interceptors.request.use(
    (config) => {
        // AQUI ESTÁ A CORREÇÃO:
        // Mudamos de 'userToken' para 'token' para bater com seu código de login
        const token = localStorage.getItem('token'); 

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;