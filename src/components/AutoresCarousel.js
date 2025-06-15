import React, { useState } from "react";
import { autores } from '../data/autoresBrasileiros';
import './AutoresCarousel.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const AutoresCarousel = () => {
  const [paginaAberta, setPaginaAberta] = useState(0);
  const [conteudoVisivel, setConteudoVisivel] = useState(true);
  const [estaVirando, setEstaVirando] = useState(false);
  const totalAutores = autores.length;

  const virarPagina = (direcao) => {
    const proximaPagina = paginaAberta + direcao;

    // Condições para não fazer nada: se já estiver virando ou se chegou ao fim/início
    if (estaVirando || proximaPagina < 0 || proximaPagina >= totalAutores) {
      return;
    }

    // --- Início da Sequência de Animação ---

    // 1. Bloqueia novos cliques e começa a esconder o conteúdo antigo da esquerda.
    setEstaVirando(true);
    setConteudoVisivel(false);

    // 2. Inicia a virada da página da direita.
    //    O React também já troca o conteúdo da esquerda, mas ele permanece invisível.
    setPaginaAberta(proximaPagina);

    // 3. NO FINAL DA ANIMAÇÃO da virada da página (que dura 1s)...
    setTimeout(() => {
      // ...faz o NOVO conteúdo aparecer na esquerda...
      setConteudoVisivel(true);
      // ...e reativa os botões para a próxima interação.
      setEstaVirando(false);
    }, 1000); // 1000ms = 1 segundo. Corresponde exatamente à duração da animação no CSS.
  };

  return (
    <div className="container-geral-livro">
      <h3 className="carousel-title">Autores para se inspirar</h3>
      
      <div className="livro-container">
        
        <div className="lado-esquerdo-fixo">
          <div className={`lado-esquerdo-conteudo ${conteudoVisivel ? 'visivel' : ''}`}>
            {autores[paginaAberta] && (
              <>
                <img src={autores[paginaAberta].fotoUrl} alt={`Foto de ${autores[paginaAberta].nome}`} className="autor-foto-livro" />
                <h4 className="autor-nome-esquerda">{autores[paginaAberta].nome}</h4>
              </>
            )}
          </div>
        </div>

        <div className="lado-direito-container">
          {autores.map((autor, index) => (
            <div
              key={autor.id}
              className={`pagina-flip ${index < paginaAberta ? 'virada' : ''}`}
              style={{ zIndex: totalAutores - index }}
            >
              <div className="pagina-frente">
                <div className="pagina-conteudo">
                  <h5>{autor.nome}</h5>
                  <p className="autor-bio">{autor.biografia}</p>
                  <h6>Principais Obras:</h6>
                  <ul>
                    {autor.principaisObras.map((obra) => (
                      <li key={obra}>{obra}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="pagina-verso"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="navegacao">
        <button onClick={() => virarPagina(-1)} disabled={estaVirando || paginaAberta === 0}>
          <FontAwesomeIcon icon={faChevronLeft} /> Anterior
        </button>
        <button onClick={() => virarPagina(1)} disabled={estaVirando || paginaAberta === totalAutores - 1}>
          Próximo <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default AutoresCarousel;