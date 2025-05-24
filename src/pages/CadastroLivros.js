import React, { useEffect, useState, useRef } from 'react';
import '../styles/CadastroLivros.css';
import api from '../services/api.js';

function CadastroLivro() {
  const token = localStorage.getItem('token');
  const livro = {
    id: null,
    autor: '',
    descricao: '',
    titulo: '',
    pdf: null,
    capa: null,
  };

  const inputPdfRef = useRef(null);
  const inputCapaRef = useRef(null);
  const [livros, setLivros] = useState([]);
  const [objLivro, setObjLivro] = useState(livro);
  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [previewCapa, setPreviewCapa] = useState(null);

  const getLivros = async () => {
    try {
      const response = await api.get('/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLivros(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLivros();
  }, []);

  const cadastrarLivro = async (e) => {
    e.preventDefault();
    if (!objLivro.titulo.trim()) return alert('O preenchimento do campo "Título do Livro" é obrigatório.');
    if (!objLivro.autor.trim()) return alert('O preenchimento do campo "Autor" é obrigatório.');

    const formData = new FormData();
    formData.append('titulo', objLivro.titulo);
    formData.append('autor', objLivro.autor);
    formData.append('descricao', objLivro.descricao);
    if (objLivro.pdf) formData.append('pdf', objLivro.pdf);
    if (objLivro.capa) formData.append('capa', objLivro.capa);

    try {
      const response = await api.post('/cadastrar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setLivros([...livros, response.data]);
      alert('Livro cadastrado com sucesso!');
      limparFormulario();
    } catch (error) {
      console.log(error);
    }
  };

  const alterarLivro = async () => {
    if (!objLivro.titulo.trim()) return alert('O preenchimento do campo "Título do Livro" é obrigatório.');
    if (!objLivro.autor.trim()) return alert('O preenchimento do campo "Autor" é obrigatório.');

    const formData = new FormData();
    formData.append('id', objLivro.id);
    formData.append('titulo', objLivro.titulo);
    formData.append('autor', objLivro.autor);
    formData.append('descricao', objLivro.descricao);
    if (objLivro.pdf) formData.append('pdf', objLivro.pdf);
    if (objLivro.capa) formData.append('capa', objLivro.capa);

    try {
      const response = await api.put('/alterar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const livrosAtualizados = livros.map((livro) =>
        livro.id === response.data.id ? response.data : livro
      );
      setLivros(livrosAtualizados);
      alert('Livro alterado com sucesso!');
      limparFormulario();
    } catch (error) {
      console.log(error);
    }
  };

  const excluirLivro = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este livro?')) return;

    try {
      await api.delete(`/excluir/${objLivro.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const livrosFiltrados = livros.filter((livro) => livro.id !== objLivro.id);
      setLivros(livrosFiltrados);
      alert('Livro excluído com sucesso!');
      limparFormulario();
    } catch (error) {
      console.log(error);
    }
  };

  const limparFormulario = () => {
    setObjLivro(livro);
    if (inputPdfRef.current) inputPdfRef.current.value = '';
    if (inputCapaRef.current) inputCapaRef.current.value = '';
    setPreviewCapa(null);
    setBtnCadastrar(true);
  };

  const aoDigitar = (e) => {
    setObjLivro({ ...objLivro, [e.target.name]: e.target.value });
  };

  const aoEscolherPdf = (e) => {
    setObjLivro({ ...objLivro, pdf: e.target.files[0] });
  };

  const aoEscolherCapa = (e) => {
    const file = e.target.files[0];
    setObjLivro({ ...objLivro, capa: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewCapa(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewCapa(null);
    }
  };

  return (
    <div className="cadastro-livro-container">
      <h2 className="cadastro-titulo">Cadastrar Novo Livro</h2>
      <form className="cadastro-form" onSubmit={(e) => btnCadastrar ? cadastrarLivro(e) : e.preventDefault()}>
        <label htmlFor="titulo">Título do Livro</label>
        <input
          type="text"
          name="titulo"
          id="titulo"
          value={objLivro.titulo}
          onChange={aoDigitar}
          required
        />

        <label htmlFor="autor">Autor</label>
        <input
          type="text"
          name="autor"
          id="autor"
          value={objLivro.autor}
          onChange={aoDigitar}
          required
        />

        <label htmlFor="descricao">Descrição</label>
        <textarea
          className="form-control"
          name="descricao"
          id="descricao"
          value={objLivro.descricao}
          rows="5"
          placeholder="Digite a descrição aqui..."
          onChange={aoDigitar}
        ></textarea>

        <label htmlFor="pdf">Arquivo PDF</label>
        <input
          type="file"
          accept="application/pdf"
          id="pdf"
          ref={inputPdfRef}
          onChange={aoEscolherPdf}
        />

        <label htmlFor="capa">Imagem da Capa</label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          id="capa"
          ref={inputCapaRef}
          onChange={aoEscolherCapa}
        />
        {previewCapa && (
          <div className="preview-capa">
            <p>Preview da Capa:</p>
            <img src={previewCapa} alt="Preview da capa" />
          </div>
        )}

        <div className="botoes-container">
          {btnCadastrar ? (
            <button type="submit">Cadastrar</button>
          ) : (
            <>
              <button type="button" onClick={alterarLivro}>Alterar</button>
              <button type="button" onClick={excluirLivro}>Excluir</button>
              <button type="button" onClick={limparFormulario}>Cancelar</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default CadastroLivro;
