import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginUsuario = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });

      const { token, name: userName } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      navigate('/dashboard');
    } catch (err) {
      setError('E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Login do Usuário</h2>
        <form onSubmit={handleLogin}>
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
            <button type="submit" className="btn btn-primary">Entrar</button>
          </div>
        </form>
        <div className="text-center mt-3">
          <span>Não tem uma conta? </span>
          <Link to="/cadastro-usuario">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginUsuario;
