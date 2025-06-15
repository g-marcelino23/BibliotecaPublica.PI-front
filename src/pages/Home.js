import React, { useState } from 'react';
import '../styles/Home.css';
// ALTERADO: Importação do vídeo ao invés da imagem
import videoBg from '../assets/videos/home.mp4'; // **VERIFIQUE SE O CAMINHO DO SEU VÍDEO ESTÁ CORRETO**
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaUserPlus, FaSignInAlt, FaShieldAlt } from 'react-icons/fa';

function Home() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerRole, setRegisterRole] = useState('USER');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    document.title = `Biblioteca Online | ${isRegistering ? 'Cadastro' : 'Login'}`;

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
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('E-mail ou senha inválidos. Tente novamente.');
            }
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
                role: registerRole, 
            });
            const { token, name: userName } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userName', userName);
            navigate('/dashboard');
        } catch (err) {
               if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Erro ao registrar. Verifique os dados e tente novamente.');
            }
        }
    };

    return (
        <div className="home-container">
            <div className="home-content">
                {/* Coluna esquerda: vídeo com texto sobreposto */}
                <div className="home-media">
                    {/* ALTERADO: Adicionado o elemento de vídeo novamente */}
                    <video className="video-background" autoPlay loop muted playsInline>
                        <source src={videoBg} type="video/mp4" />
                        Seu navegador não suporta vídeo.
                    </video>
                    <div className="media-overlay-text">
                        <h1>Bem-vindo(a) à Biblioteca Pública Digital</h1>
                        <p>Explore um universo de conhecimento. Milhares de livros, artigos e recursos, sempre ao seu alcance.</p>
                    </div>
                </div>

                {/* Coluna direita: login / cadastro */}
                <div className="auth-form-section">
                    {!isRegistering ? (
                        <form onSubmit={handleLogin} className="auth-form animate">
                            <h2><FaSignInAlt /> Entrar</h2>
                            <div className="input-group">
                                <FaEnvelope /><input type="email" placeholder="E-mail" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <FaLock /><input type="password" placeholder="Senha" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                            </div>
                            {error && <div className="alert-message error">{error}</div>}
                            <button type="submit" className="btn btn-primary">Acessar Biblioteca</button>
                            <p className="switch-form-text">
                                Não tem uma conta?{' '}
                                <span onClick={() => { setIsRegistering(true); setError(''); }} className="link-text">Cadastre-se</span>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="auth-form animate">
                            <h2><FaUserPlus /> Criar Conta</h2>
                            <div className="input-group">
                                <FaUser /><input type="text" placeholder="Nome Completo" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <FaEnvelope /><input type="email" placeholder="E-mail" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <FaLock /><input type="password" placeholder="Crie uma Senha" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required />
                            </div>

                            {/* Campo de seleção para a role */}
                            {/* ATENÇÃO: Recomendo FORTEMENTE remover a opção ADMIN de um formulário de registro público em produção. */}
                            <div className="input-group">
                                <FaShieldAlt />
                                <select value={registerRole} onChange={(e) => setRegisterRole(e.target.value)} required>
                                    <option value="USER">Usuário</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            {error && <div className="alert-message error">{error}</div>}
                            <button type="submit" className="btn btn-success">Registrar</button>
                            <p className="switch-form-text">
                                Já tem uma conta?{' '}
                                <span onClick={() => { setIsRegistering(false); setError(''); }} className="link-text">Fazer Login</span>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;