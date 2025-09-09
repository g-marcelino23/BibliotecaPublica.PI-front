// src/pages/CadastroLivros.js
import React, { useEffect, useState, useRef } from 'react';
import '../styles/CadastroLivros.css';
import api from '../services/api.js';
import apiUsuario from '../services/usuarioApi.js';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CadastroLivro() {
  const { livroId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const initialStateLivro = {
    id: null,
    autor: '',
    descricao: '',
    titulo: '',
    pdf: null,
    capa: null,
    caminhoArquivo: '',
    caminhoCapa: '',
    categoria: '',
    classificacaoIndicativa: "L"
  };

  const inputPdfRef = useRef(null);
  const inputCapaRef = useRef(null);
  const [objLivro, setObjLivro] = useState(initialStateLivro);
  const [isEditMode, setIsEditMode] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

const [categorias, setCategorias] = useState([])


  // NOVA FUNÇÃO APENAS PARA LIMPAR OS CAMPOS
  const limparFormulario = () => {
    setObjLivro(initialStateLivro);
    if (inputPdfRef.current) inputPdfRef.current.value = '';
    if (inputCapaRef.current) inputCapaRef.current.value = '';
  };

  useEffect(() => {
    if (livroId) {
      setIsEditMode(true);
      if (!token) {
        setFeedback({ message: "Token não encontrado. Faça login para editar.", type: "error" });
        return;
      }
      api.get(`/byId/${livroId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        const dadosDoServidor = response.data;
        setObjLivro({
          ...initialStateLivro,
          ...dadosDoServidor,
          id: dadosDoServidor.id,
          pdf: null,
          capa: null,
          classificacaoIndicativa: dadosDoServidor.classificacaoIndicativa || "",
        });
      })
      .catch(error => {
        console.error("Erro ao buscar livro para edição:", error);
        setFeedback({ message: "Erro ao carregar dados do livro para edição.", type: "error" });
      });
    } else {
      setIsEditMode(false);
      setObjLivro(initialStateLivro);
    }
  }, [livroId, token]);


  useEffect(() => {
  const carregarCategorias = async ()=> {
    try {
      const resposta = await apiUsuario.get("/categoria");
      setCategorias(resposta.data);
    } catch(err) {
      console.log(err.message);
    }
  };
  carregarCategorias();
}, []);

  // FUNÇÃO ATUALIZADA
  const limparFormularioENavegar = (navegar = true) => {
    limparFormulario(); // Reutiliza a nova função
    setIsEditMode(false);
    setFeedback({ message: '', type: '' });
    if (navegar) {
      navigate('/lista-livros');
    }
    if (livroId && !navegar) {
        navigate('/cadastrar');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ message: '', type: '' });

    if (!token) {
      setFeedback({ message: "Operação não permitida. Faça login.", type: "error" });
      return;
    }
    if (!objLivro.titulo.trim() || !objLivro.autor.trim()) {
      alert('Os campos "Título" e "Autor" são obrigatórios.');
      return;
    }
    
    const formData = new FormData();
    formData.append('titulo', objLivro.titulo);
    formData.append('autor', objLivro.autor);
    formData.append('descricao', objLivro.descricao);
    formData.append('categoria', objLivro.categoria);
    formData.append('classificacaoIndicativa', objLivro.classificacaoIndicativa);

    if (objLivro.pdf instanceof File) {
      formData.append('pdf', objLivro.pdf);
    } else if (!isEditMode && !objLivro.pdf) {
      alert('O arquivo PDF é obrigatório para cadastrar.');
      return;
    }

    if (objLivro.capa instanceof File) {
      formData.append('capa', objLivro.capa);
    } else if (!isEditMode && !objLivro.capa) {
      alert('A imagem da capa é obrigatória para cadastrar.');
      return;
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    };

    try {
      if (isEditMode) {
        await api.put(`/alterar/${objLivro.id}`, formData, config);
        setFeedback({ message: 'Livro alterado com sucesso!', type: 'success' });
        setTimeout(() => limparFormularioENavegar(true), 1500);
      } else {
        // LÓGICA DE CADASTRO ATUALIZADA
        await api.post("/cadastrar", formData, config);
        setFeedback({ message: 'Livro cadastrado com sucesso!', type: 'success' });
        limparFormulario(); // Apenas limpa o formulário, mantendo a mensagem
      }
    } catch (error) {
      console.error("Erro ao salvar livro:", error.response ? error.response.data : error.message);
      setFeedback({ message: `Erro ao salvar livro: ${error.response?.data?.message || 'Verifique os dados.'}`, type: 'error' });
    }
  };

  const excluirLivro = async () => {
    // ... (lógica de exclusão permanece a mesma)
    if (!objLivro.id) return;
    if (window.confirm(`Tem certeza que deseja excluir o livro "${objLivro.titulo}"?`)) {
      try {
        if (!token) {
          setFeedback({ message: "Operação não permitida. Faça login.", type: "error" });
          return;
        }
        await api.delete(`/deletar/${objLivro.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeedback({ message: "Livro excluído com sucesso!", type: 'success' });
        setTimeout(() => limparFormularioENavegar(true), 1500);
      } catch (error) {
        console.error("Erro ao excluir livro:", error);
        setFeedback({ message: "Erro ao excluir livro.", type: 'error' });
      }
    }
  };

  const aoDigitar = (e) => {
    setObjLivro({ ...objLivro, [e.target.name]: e.target.value });
  };

  const aoEscolherArquivo = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setObjLivro({ ...objLivro, [name]: files[0] });
    } else {
      setObjLivro({ ...objLivro, [name]: null });
    }
  };

  // O JSX do formulário continua o mesmo
  return (
    <div className="cadastro-livro-container">
      {/* ... (todo o seu JSX do return permanece igual) ... */}
      <h2 className="cadastro-titulo">
        {isEditMode ? `Editando Livro` : "Cadastrar Novo Livro"}
      </h2>
      
      <form className="cadastro-form" onSubmit={handleSubmit} noValidate>
        {feedback.message && (
          <p className={`feedback feedback-${feedback.type === 'error' ? 'erro' : 'sucesso'}`}>
            {feedback.message}
          </p>
        )}

        <div className="form-grupo">
          <label htmlFor="titulo">Título do Livro</label>
          <input id="titulo" type="text" name="titulo" value={objLivro.titulo} onChange={aoDigitar} required />
        </div>

        <div className='form-grupo'>
          <label htmlFor="categorias">Categorias</label>
            {/* <select id='categorias' value={objLivro.categoria} onChange={(e) => setObjLivro({...objLivro, categoria: e.target.value})}> */}

            <select
              id="categorias"
              value={objLivro.categoria}
              onChange={(e) =>
                setObjLivro({ ...objLivro, categoria: e.target.value })}
              >
             <option value="">Selecione uma categoria</option> {categorias.map((cat) => ( <option key={cat} value={cat}> {cat} </option>
              ))}
            </select>
        </div>

        <div className="form-grupo">
          <label htmlFor="classificacaoIndicativa">Classificação Indicativa</label>
          <select
            id="classificacaoIndicativa"
            name="classificacaoIndicativa"
            value={objLivro.classificacaoIndicativa}
            onChange={aoDigitar}
            required
          >
            <option value="">Selecione</option>
            <option value="L">L</option>
            <option value="DEZ">10</option>
            <option value="DOZE">12</option>
            <option value="QUATORZE">14</option>
            <option value="DEZESSEIS">16</option>
            <option value="DEZOITO">18</option>
          </select>
        </div>

        <div className="form-grupo full-width">
          <label htmlFor="autor">Autor</label>
          <input id="autor" type="text" name="autor" value={objLivro.autor} onChange={aoDigitar} required />
        </div>

        <div className="form-grupo full-width">
          <label htmlFor="descricao">Descrição</label>
          <textarea id="descricao" name="descricao" value={objLivro.descricao} rows="5" placeholder="Digite a descrição aqui..." onChange={aoDigitar}></textarea>
        </div>

        <div className="form-grupo">
          <label htmlFor="pdf" className="input-arquivo-customizado">
            <span>📚 Clique para selecionar o PDF</span>
            <input id="pdf" type="file" name="pdf" accept="application/pdf" ref={inputPdfRef} onChange={aoEscolherArquivo} />
          </label>
          <div className="nome-arquivo">
            {objLivro.pdf ? objLivro.pdf.name : (isEditMode && objLivro.caminhoArquivo ? `Atual: ${objLivro.caminhoArquivo}` : 'Nenhum arquivo selecionado')}
          </div>
        </div>

        <div className="form-grupo">
          <label htmlFor="capa" className="input-arquivo-customizado">
            <span>🖼️ Clique para selecionar a Capa</span>
            <input id="capa" type="file" name="capa" accept="image/*" ref={inputCapaRef} onChange={aoEscolherArquivo} />
          </label>
          <div className="nome-arquivo">
            {objLivro.capa ? objLivro.capa.name : (isEditMode && objLivro.caminhoCapa ? `Atual: ${objLivro.caminhoCapa}` : 'Nenhuma imagem selecionada')}
          </div>
        </div>
        
        <div className="botoes-container">
          {!isEditMode ? (
            <>
              <button type="button" className="btn btn-neutro" onClick={() => limparFormularioENavegar(false)}>Limpar</button>
              <button type="submit" className="btn btn-primario">Cadastrar Livro</button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-neutro" onClick={() => limparFormularioENavegar(true)}>Cancelar</button>
              <button type="button" className="btn btn-perigo" onClick={excluirLivro}>Excluir</button>
              <button type="submit" className="btn btn-primario">Salvar Alterações</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default CadastroLivro;