import React, { useState, useEffect } from 'react';
import './AccessibilityControls.css'; // vamos criar o CSS depois

const AccessibilityControls = () => {
  const [fontScale, setFontScale] = useState(1);
  const [isReading, setIsReading] = useState(false);

  // Aplicar o tamanho da fonte no body
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 16}px`;
  }, [fontScale]);

  // Aumentar fonte
  const increaseFont = () => {
    setFontScale(prev => Math.min(prev + 0.1, 2)); // máximo 150%
  };

  // Diminuir fonte
  const decreaseFont = () => {
    setFontScale(prev => Math.max(prev - 0.1, 0.5)); // mínimo 80%
  };

  // Resetar fonte
  const resetFont = () => {
    setFontScale(1);
  };

  // Ler o conteúdo da página
  const readPageContent = () => {
    // Cancela qualquer leitura anterior
    window.speechSynthesis.cancel();

    // Pega todo o texto visível da página (excluindo scripts, styles, etc.)
    const mainContent = document.querySelector('main') || document.body;
    const textToRead = mainContent.innerText;

    if (!textToRead || textToRead.trim() === '') {
      alert('Nenhum conteúdo encontrado para ler.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 1; // velocidade normal
    utterance.pitch = 1; // tom normal

    // Quando terminar de ler
    utterance.onend = () => {
      setIsReading(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  // Parar a leitura
  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  return (
    <div className="accessibility-controls">
      <div className="font-controls">
        <button onClick={decreaseFont} title="Diminuir fonte">A-</button>
        <button onClick={resetFont} title="Tamanho padrão">A</button>
        <button onClick={increaseFont} title="Aumentar fonte">A+</button>
        <div className="reading-controls">
            {!isReading ? (
            <button onClick={readPageContent} title="Ler conteúdo da página">
                🔊 Ler página
            </button>
            ) : (
            <button onClick={stopReading} title="Parar leitura">
                ⏸️ Parar
            </button>
            )}
        </div>
      </div>

    </div>
  );
};

export default AccessibilityControls;
