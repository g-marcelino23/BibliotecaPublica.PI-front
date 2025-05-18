import React from 'react';
import '../styles/Home.css';
import videoBg from '../assets/videos/home.mp4'; 
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <video className="video-background" autoPlay loop muted>
        <source src={videoBg} type="video/mp4" />
        Seu navegador não suporta vídeo em segundo plano.
      </video>

      <div className="overlay">
        <h1 className="home-title">BIBLIOTECA PÚBLICA ONLINE</h1>
        <div className="home-buttons">

          <Link to="/login-usuario" className="btn btn-outline-light btn-lg">Login</Link>
          <Link to="/cadastro-usuario" className="btn btn-outline-light btn-lg">Cadastre-se</Link>
          <Link to="/acervo" className="btn btn-outline-light btn-lg">Acessar Acervo</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
