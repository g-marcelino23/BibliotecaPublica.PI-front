import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CadastroUsuario = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name,
        email,
        password,
      });

      const { token, name: userName } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro na requisição:', err);

      if (err.response) {
        console.error('Resposta da API:', err.response.data);
        setError(err.response.data.message || 'Erro ao registrar. Verifique os dados e tente novamente.');
      } else if (err.request) {
        console.error('Sem resposta da API:', err.request);
        setError('Servidor não respondeu. Verifique a conexão.');
      } else {
        console.error('Erro desconhecido:', err.message);
        setError('Erro inesperado. Tente novamente.');
      }
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Cadastro de Usuário</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="d-grid">
            <button type="submit" className="btn btn-success">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroUsuario;