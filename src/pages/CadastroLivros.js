import React, { useState } from 'react';
import '../styles/CadastroLivros.css';

function CadastroLivro() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [pdf, setPdf] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      titulo,
      autor,
      descricao,
      pdf
    });
    // Lucas e Rodrigo aqui é para implementar a lógica de upload do PDF e salvar os dados no backend
  };

  return (
    <div className="cadastro-livro-container">
      <h2 className="cadastro-titulo">Cadastrar Novo Livro</h2>
      <form className="cadastro-form" onSubmit={handleSubmit}>
        <label>Título do Livro</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <label>Autor</label>
        <input
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          required
        />

        <label>Arquivo PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files[0])}
          required
        />

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroLivro;
