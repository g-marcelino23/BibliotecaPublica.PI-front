import React, { useEffect, useState, useRef } from 'react';
import '../styles/CadastroLivros.css';
import api from '../services/api.js';
import Tabela from './Tabela';

function CadastroLivro() {
  const token = localStorage.getItem('token');
  const livro = {
    autor : '',
    descricao : '',
    titulo : '',
    pdf: null,
    capa: null,  
  }

  const inputPdfRef = useRef(null);
  const [livros, setLivros] = useState([]);
  const [objLivro, setObjLivro] = useState(livro);
  const [btnCadastrar, setBtnCadastrar] = useState(true);

  const getLivros = async () => {
    try {
      const response = await api.get("/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setLivros(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getLivros();
  }, []);

  const cadastrarLivro = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (!objLivro.titulo.trim()) {
      alert('O preenchimento do campo "Título do Livro" é obrigatório.');
      return;
    } 
    if (!objLivro.autor.trim()) {
      alert('O preenchimento do campo "Autor" é obrigatório.');
      return;
    }

    formData.append('titulo', objLivro.titulo);
    formData.append('autor', objLivro.autor);
    formData.append('descricao', objLivro.descricao);

    if (objLivro.pdf) {
      formData.append('pdf', objLivro.pdf);
    }

    if (objLivro.capa) {
      formData.append('capa', objLivro.capa);
    }

    try {
      const response = await api.post("/cadastrar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      setLivros([...livros, response.data]);
      alert('Livro cadastrado com sucesso!');
      limparFormulario();
    } catch (error) {
      console.log(error);
    }
  };

  const alterarLivro = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (!objLivro.titulo.trim()) {
      alert('O preenchimento do campo "Título do Livro" é obrigatório.');
      return;
    } 
    if (!objLivro.autor.trim()) {
      alert('O preenchimento do campo "Autor" é obrigatório.');
      return;
    }

    formData.append('titulo', objLivro.titulo);
    formData.append('autor', objLivro.autor);
    formData.append('descricao', objLivro.descricao);

    if (objLivro.pdf) {
      formData.append('pdf', objLivro.pdf);
    }

    if (objLivro.capa) {
      formData.append('capa', objLivro.capa);
    }

    try {
      const response = await api.put(`/alterar/${objLivro.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      let arrayTemp = [...livros];
      let indice = arrayTemp.findIndex((obj) => obj.id === objLivro.id);
      arrayTemp[indice] = response.data;

      setLivros(arrayTemp);
      alert('Livro alterado com sucesso!');
      limparFormulario();
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
  };

  const excluirLivro = async (e) => {
    e.preventDefault();
    try {
      await api.delete(`/deletar/${objLivro.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Livro excluído com sucesso!");

      let arrayTemp = [...livros];
      let indice = arrayTemp.findIndex((obj) => obj.id === objLivro.id);
      arrayTemp.splice(indice, 1);
      setLivros(arrayTemp);
      limparFormulario();
    } catch (error) {
      console.log(error);
    }
  };

  const limparFormulario = () => {
    setObjLivro(livro);
    if (inputPdfRef.current) inputPdfRef.current.value = '';
    setBtnCadastrar(true);
  };

  const selecionarLivro = (indice) => {
    setObjLivro(livros[indice]);
    setBtnCadastrar(false);
  };

  const aoDigitar = (e) => {
    setObjLivro({ ...objLivro, [e.target.name]: e.target.value });
  };

  const aoEscolherPdf = (e) => {
    setObjLivro({ ...objLivro, pdf: e.target.files[0] });
  };

  const aoEscolherCapa = (e) => {
    setObjLivro({ ...objLivro, capa: e.target.files[0] });
  };

  return (
    <div>
      <div className="cadastro-livro-container">
        <h2 className="cadastro-titulo">Cadastrar Novo Livro</h2>
        <form className="cadastro-form">
          <label>Título do Livro</label>
          <input
            type="text"
            name="titulo"
            value={objLivro.titulo}
            onChange={aoDigitar}
            required
          />

          <label>Autor</label>
          <input
            type="text"
            name="autor"
            value={objLivro.autor}
            onChange={aoDigitar}
            required
          />

          <label>Descrição</label>
          <textarea 
            name="descricao"
            value={objLivro.descricao}
            rows="5"
            placeholder="Digite a descrição aqui..."
            onChange={aoDigitar}>
          </textarea>

          <label>Arquivo PDF</label>
          <input
            type="file"
            accept="application/pdf"
            ref={inputPdfRef}
            onChange={aoEscolherPdf}
          />

          <label>Imagem da Capa</label>
          <input
            type="file"
            accept="image/*"
            onChange={aoEscolherCapa}
          />

          {btnCadastrar ? (
            <div>
              <input value="Cadastrar" type="button" onClick={cadastrarLivro} />
            </div>
          ) : (
            <div>
              <input value="Alterar" type="button" onClick={alterarLivro} />
              <input value="Excluir" type="button" onClick={excluirLivro} />
              <input value="Cancelar" type="button" onClick={limparFormulario} />
            </div>
          )}
        </form>
      </div>

      <div>
        <Tabela arrayLivros={livros} selecionar={selecionarLivro} />
      </div>
    </div>
  );
}

export default CadastroLivro;
