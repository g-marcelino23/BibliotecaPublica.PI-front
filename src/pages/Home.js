import React, { useState } from 'react';
import '../styles/Home.css';
import videoBg from '../assets/videos/home.mp4';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

function Home() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });
      const { token, name: userName } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      navigate('/dashboard');
    } catch (err) {
      setError('E-mail ou senha inválidos.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      const { token, name: userName } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao registrar. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className={`home-wrapper ${isRegistering ? 'register-mode' : ''}`}>
      <div className="content-container">
        {/* Coluna esquerda: vídeo com texto sobreposto */}
        <div className="video-text-container">
          <video className="video-background" autoPlay loop muted>
            <source src={videoBg} type="video/mp4" />
            Seu navegador não suporta vídeo.
          </video>
          <div className="overlay-text">
            <h1>Bem-vindo à Biblioteca Pública Online</h1>
            <p>Explore milhares de livros digitais e amplie seu conhecimento onde estiver.</p>
          </div>
        </div>

        {/* Coluna direita: login / cadastro */}
        <div className="form-container">
          {!isRegistering ? (
            <form onSubmit={handleLogin} className="form-box animate">
              <h2><FaSignInAlt /> Login</h2>
              <div className="input-icon"><FaEnvelope /><input type="email" placeholder="E-mail" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required /></div>
              <div className="input-icon"><FaLock /><input type="password" placeholder="Senha" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required /></div>
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary">Entrar</button>
              <p className="switch-text">
                Não tem uma conta?{' '}
                <span onClick={() => setIsRegistering(true)} className="link-text">Cadastre-se aqui</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="form-box animate">
              <h2><FaUserPlus /> Cadastro</h2>
              <div className="input-icon"><FaUser /><input type="text" placeholder="Nome" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required /></div>
              <div className="input-icon"><FaEnvelope /><input type="email" placeholder="E-mail" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required /></div>
              <div className="input-icon"><FaLock /><input type="password" placeholder="Senha" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required /></div>
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-success">Cadastrar</button>
              <p className="switch-text">
                Já tem uma conta?{' '}
                <span onClick={() => setIsRegistering(false)} className="link-text">Entrar</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
