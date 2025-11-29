// src/components/AssistantPanel.js
import React, { useState } from "react";
import "./assistant.css";

function AssistantPanel({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply || "Sem resposta." },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Erro ao falar com a IA. Tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="assistant-panel">
      <header className="assistant-header">
        <div className="assistant-title">
          <span className="assistant-label">Assistente Literário</span>
        </div>
        <button className="assistant-close" onClick={onClose}>
          ×
        </button>
      </header>

      <div className="assistant-messages">
        {messages.length === 0 && (
          <div className="assistant-welcome">
            <div className="welcome-icon">📚</div>
            <h3>Olá! Como posso ajudar?</h3>
            <div className="welcome-suggestions">
              <button onClick={() => setInput("Recomende um livro de ficção científica")}>
                📖 Recomendar livros
              </button>
              <button onClick={() => setInput("Quais os melhores autores para começar o hábito da leitura?")}>
                ✍️ Informações sobre autores
              </button>
              <button onClick={() => setInput("Qual a diferença entre romance e novela?")}>
                💡 Dúvidas sobre literatura
              </button>
              <button onClick={() => setInput("Como organizar meu tempo para ler diariamente?")}>
                📂 Dicas de organização
              </button>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`msg msg-${m.role}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="msg msg-assistant">Pensando...</div>}
      </div>

      <form className="assistant-input" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre livros, autores ou literatura..."
        />
        <button type="submit" disabled={loading}>
          ➤
        </button>
      </form>
    </div>
  );
}

export default AssistantPanel;
