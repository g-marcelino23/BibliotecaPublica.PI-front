// src/components/FloatingAssistantButton.js
import React from 'react';
import './assistant.css';

function FloatingAssistantButton({ onClick, isOpen }) {
  if (isOpen) return null; // Não renderiza se o painel estiver aberto

  return (
    <button className="assistant-fab" onClick={onClick}>
      ?
    </button>
  );
}

export default FloatingAssistantButton;
