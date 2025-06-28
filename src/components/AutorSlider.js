// src/components/AutorSlider.js

import React, { useState } from 'react';
import { autores } from '../data/autoresBrasileiros';
import '../components/AutorSlider.css'; // Novo arquivo de estilo

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const AutorSlider = () => {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [isFading, setIsFading] = useState(false); // Estado para controlar a animação

  const autor = autores[indiceAtual]; // Acessa o autor atual de forma mais limpa

  const navegar = (direcao) => {
    const novoIndice = indiceAtual + direcao;
    if (novoIndice < 0 || novoIndice >= autores.length || isFading) {
      return; // Não faz nada se estiver fora dos limites ou animando
    }

    // 1. Inicia o "fade-out"
    setIsFading(true);

    // 2. Após a animação de saída, troca o conteúdo e inicia o "fade-in"
    setTimeout(() => {
      setIndiceAtual(novoIndice);
      setIsFading(false);
    }, 300); // Duração deve ser a mesma da transição no CSS
  };

  return (
    <div className="slider-container">
      <h3 className="slider-titulo">Autores para se Inspirar</h3>
      
      <div className="slider-wrapper">
        <button onClick={() => navegar(-1)} className="slider-nav-button prev" disabled={isFading || indiceAtual === 0}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        {/* O conteúdo do slider que terá o efeito de fade */}
        <div className={`slider-content ${isFading ? 'fading' : ''}`}>
          {/* Coluna da Esquerda: Foto e Nome */}
          <div className="slider-coluna-esquerda">
            <img src={autor.fotoUrl} alt={`Foto de ${autor.nome}`} className="autor-foto" />
            <h4 className="autor-nome">{autor.nome}</h4>
          </div>

          {/* Coluna da Direita: Biografia e Obras */}
          <div className="slider-coluna-direita">
            <h5>Biografia</h5>
            <p className="autor-bio">{autor.biografia}</p>
            
            <h6>Principais Obras</h6>
            <ul className="obras-lista">
              {autor.principaisObras.map((obra) => (
                <li key={obra}>{obra}</li>
              ))}
            </ul>
          </div>
        </div>

        <button onClick={() => navegar(1)} className="slider-nav-button next" disabled={isFading || indiceAtual === autores.length - 1}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default AutorSlider;