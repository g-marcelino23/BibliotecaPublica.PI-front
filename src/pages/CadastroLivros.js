// src/components/CadastroLivro.js
import React, { useEffect, useState, useRef } from 'react';
import '../styles/CadastroLivros.css';
import api from '../services/api.js';
import { useParams, useNavigate } from 'react-router-dom'; // Hooks para rota e navegação

// import Tabela from './Tabela'; // REMOVER - Tabela não será mais usada aqui

function CadastroLivro() {
  const { livroId } = useParams(); // Pega o :livroId da URL -> /editar/:livroId
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const initialStateLivro = {
    id: null, // Importante para o modo de edição
    autor: '',
    descricao: '',
    titulo: '',
    pdf: null,   // Representará o File object para upload
    capa: null,  // Representará o File object para upload
    caminhoArquivo: '', // Para mostrar o nome do PDF existente na edição
    caminhoCapa: ''     // Para mostrar o nome da capa existente na edição
  };

  const inputPdfRef = useRef(null);
  const inputCapaRef = useRef(null);
  const [objLivro, setObjLivro] = useState(initialStateLivro);
  const [isEditMode, setIsEditMode] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' }); // Para mensagens de sucesso/erro

  useEffect(() => {
    if (livroId) {
      setIsEditMode(true);
      if (!token) {
        setFeedback({ message: "Token não encontrado. Faça login para editar.", type: "error" });
        return;
      }
      api.get(`/byId/${livroId}`, { // Sua API para buscar livro por ID
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        // Preenche o formulário com os dados do livro, mas mantém pdf e capa como null
        // pois o usuário precisará selecionar novos arquivos se quiser alterá-los.
        // Os campos caminhoArquivo e caminhoCapa são guardados para informação.
        const dadosDoServidor = response.data;
        setObjLivro({
          ...initialStateLivro, // Garante que todos os campos estão presentes
          ...dadosDoServidor, // Sobrescreve com dados do servidor
          id: dadosDoServidor.id, // Garante que o ID está correto
          pdf: null, // Limpa para que o usuário tenha que selecionar um novo PDF se quiser mudar
          capa: null  // Limpa para que o usuário tenha que selecionar uma nova capa se quiser mudar
        });
      })
      .catch(error => {
        console.error("Erro ao buscar livro para edição:", error);
        setFeedback({ message: "Erro ao carregar dados do livro para edição.", type: "error" });
        // navigate('/livros'); // Opcional: redirecionar se não encontrar
      });
    } else {
      setIsEditMode(false);
      setObjLivro(initialStateLivro); // Limpa para novo cadastro
    }
  }, [livroId, token]); // Re-executa se livroId ou token mudarem

  const limparFormularioENavegar = (navegar = true) => {
    setObjLivro(initialStateLivro);
    if (inputPdfRef.current) inputPdfRef.current.value = '';
    if (inputCapaRef.current) inputCapaRef.current.value = '';
    setIsEditMode(false);
    setFeedback({ message: '', type: '' });
    if (navegar && livroId) { // Se estava editando e cancelou/concluiu, volta para lista
        navigate('/lista-livros');
    } else if (navegar) { // Se estava cadastrando e limpou/concluiu, volta para lista
        navigate('/lista-livros');
    } else if (livroId) { // Se cancelou a edição mas não quer navegar, volta para /cadastrar
        navigate('/cadastrar');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ message: '', type: '' }); // Limpa feedback anterior

    if (!token) {
      setFeedback({ message: "Operação não permitida. Faça login.", type: "error" });
      return;
    }

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

    // Para arquivos, só adiciona ao formData se um novo arquivo foi selecionado
    if (objLivro.pdf instanceof File) {
      formData.append('pdf', objLivro.pdf);
    } else if (!isEditMode && !objLivro.pdf) { // Obrigatório para novo cadastro
        alert('O arquivo PDF é obrigatório para cadastrar.');
        return;
    }

    if (objLivro.capa instanceof File) {
      formData.append('capa', objLivro.capa);
    } else if (!isEditMode && !objLivro.capa) { // Obrigatório para novo cadastro
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
        setTimeout(() => limparFormularioENavegar(true), 1500); // Navega após um tempo
      } else {
        await api.post("/cadastrar", formData, config);
        setFeedback({ message: 'Livro cadastrado com sucesso!', type: 'success' });
        limparFormularioENavegar(false); // Limpa formulário, não navega automaticamente
      }
    } catch (error) {
      console.error("Erro ao salvar livro:", error.response ? error.response.data : error.message);
      setFeedback({ message: `Erro ao salvar livro: ${error.response?.data?.message || 'Verifique os dados.'}`, type: 'error' });
    }
  };

  const excluirLivro = async () => {
    if (!objLivro.id) {
      alert("ID do livro não encontrado para exclusão.");
      return;
    }
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
      setObjLivro({ ...objLivro, [name]: null }); // Mantém como null se nenhum arquivo for escolhido
    }
  };

  return (
    <div>
      <div className="cadastro-livro-container">
        <h2 className="cadastro-titulo">{isEditMode ? `Editando: ${objLivro.titulo || 'Livro'}` : "Cadastrar Novo Livro"}</h2>

        {feedback.message && (
          <p style={{ color: feedback.type === 'error' ? 'red' : 'green' }}>
            {feedback.message}
          </p>
        )}

        <form className="cadastro-form" onSubmit={handleSubmit}>
          <label htmlFor="titulo">Título do Livro</label>
          <input id="titulo" type="text" name="titulo" value={objLivro.titulo} onChange={aoDigitar} required />

          <label htmlFor="autor">Autor</label>
          <input id="autor" type="text" name="autor" value={objLivro.autor} onChange={aoDigitar} required />

          <label htmlFor="descricao">Descrição</label>
          <textarea id="descricao" name="descricao" value={objLivro.descricao} rows="5" placeholder="Digite a descrição aqui..." onChange={aoDigitar}></textarea>

          <label htmlFor="pdf">Arquivo PDF</label>
          {isEditMode && objLivro.caminhoArquivo && <small> (Atual: {objLivro.caminhoArquivo}. Selecione novo para substituir)</small>}
          <input id="pdf" type="file" name="pdf" accept="application/pdf" ref={inputPdfRef} onChange={aoEscolherArquivo} />

          <label htmlFor="capa">Imagem da Capa</label>
          {isEditMode && objLivro.caminhoCapa && <small> (Atual: {objLivro.caminhoCapa}. Selecione nova para substituir)</small>}
          <input id="capa" type="file" name="capa" accept="image/*" ref={inputCapaRef} onChange={aoEscolherArquivo} />

          <div>
            <button type="submit" style={{ marginRight: '10px' }}>
              {isEditMode ? "Salvar Alterações" : "Cadastrar Livro"}
            </button>
            {isEditMode && (
              <>
                <button type="button" onClick={excluirLivro} style={{ backgroundColor: '#dc3545', color: 'white', marginRight: '10px' }}>
                  Excluir Livro
                </button>
                <button type="button" onClick={() => limparFormularioENavegar(true)}>
                  Cancelar Edição
                </button>
              </>
            )}
            {!isEditMode && (
                 <button type="button" onClick={() => limparFormularioENavegar(false)}>Limpar Formulário</button>
            )}
          </div>
        </form>
      </div>
      {/* A TABELA FOI REMOVIDA DESTA PÁGINA */}
    </div>
  );
}

export default CadastroLivro;