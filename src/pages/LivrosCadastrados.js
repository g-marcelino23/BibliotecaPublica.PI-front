import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FaBookOpen } from 'react-icons/fa';

function LivrosCadastrados() {
  const [livros, setLivros] = useState([]);
  const token = localStorage.getItem('token');

  const getLivros = async () => {
    try {
      const response = await api.get("/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLivros(response.data);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    }
  };

  useEffect(() => {
    getLivros();
  }, []);

  return (  
    <div className="container py-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">
          <FaBookOpen className="me-2" />
          Livros Cadastrados
        </h2>
        <p className="text-muted">Veja abaixo os livros cadastrados na plataforma</p>
      </div>

      <div className="row">
        {livros.length === 0 ? (
          <p className="text-center text-muted">Nenhum livro cadastrado.</p>
        ) : (
          livros.map((livro, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">{livro.titulo}</h5>
                  <p className="card-text"><strong>Autor:</strong> {livro.autor}</p>
                  <p className="card-text"><strong>Descrição:</strong> {livro.descricao}</p>
                  
                  <div className="mt-auto">
                    <a href={livro.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary w-100">
                      Ler Livro
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LivrosCadastrados;
