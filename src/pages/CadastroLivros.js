import React, { useEffect, useState } from 'react';
import '../styles/CadastroLivros.css';
import api from '../services/api.js';
import Tabela from './Tabela';

function CadastroLivro() {

  const livro = {
    autor : '',
    descricao : '',
    titulo : '',
  }

  const [livros, setLivros] = useState([])
  const [objLivro, setObjLivro] = useState(livro);
  const [btnCadastrar, setBtnCadastrar] = useState(true)
  
  // const [pdf, setPdf] = useState(null);


  const getLivros = async () => {
    try {
      const response = await api.get("/all");
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
    try {
      if(!objLivro.titulo || objLivro.titulo.trim() === ''){
        alert('O preenchimento do campo "Título do Livro" é obrigatório.');
        return false;
      }
      else if(!objLivro.autor || objLivro.autor.trim() === ''){
        alert('O preenchimento do campo "Autor" é obrigatório.');
        return false;
      }
      const response = await api.post("/cadastrar", objLivro);        
      setLivros([...livros, response.data]);
      console.log(response);
      alert('Livro cadastrado com sucesso!');
      limparFormulario();
      
    } catch (error) {
      console.log(error)
    }
    
  };

  const alterarLivro = async (e) => {
    e.preventDefault();

    try {
      if(!objLivro.titulo || objLivro.titulo.trim() === ''){
        alert('O preenchimento do campo "Título do Livro" é obrigatório.');
        return false;
      }
      else if(!objLivro.autor || objLivro.autor.trim() === ''){
        alert('O preenchimento do campo "Autor" é obrigatório.');
        return false;
      }
      
      const response = await api.put(`/alterar/${objLivro.id}`, objLivro);
      alert('Livro alterado com sucesso!');

      let arrayTemp = [...livros];

      let indice = arrayTemp.findIndex((obj) => {
          return obj.id === objLivro.id;
      });

      arrayTemp[indice] = objLivro;

      setLivros(arrayTemp);

      limparFormulario();

      
    } catch (error) {
      console.log(error)
    }
    
  };

  const excluirLivro = async (e) => {
    e.preventDefault();

    try {
      const response = await api.delete(`/deletar/${objLivro.id}`);
      
      alert("Livro excluído com sucesso!");
      let arrayTemp = [...livros];

      let indice = arrayTemp.findIndex((obj) => {
          return obj.id === objLivro.id;
      });

      arrayTemp.splice(indice, 1);

      setLivros(arrayTemp);
      limparFormulario();
      
    } catch (error) {
      console.log(error)
    }
  };


  const limparFormulario = () => {
    setObjLivro(livro);
    setBtnCadastrar(true);
  }

  const selecionarLivro = (indice) => {
    setObjLivro(livros[indice]);
    setBtnCadastrar(false);
  }

  const aoDigitar = (e) => {
    setObjLivro({...objLivro, [e.target.name]: e.target.value})
  }


  return (
    <div>
      <div className="cadastro-livro-container">
        <h2 className="cadastro-titulo">Cadastrar Novo Livro</h2>
        <form className="cadastro-form">
          <label>Título do Livro</label>
          <input
            type="text"
            name="titulo"
            id="titulo"
            value={objLivro.titulo}
            onChange={aoDigitar}
            required
          />

          <label>Autor</label>
          <input
            type="text"
            name="autor"
            id="autor"
            value={objLivro.autor}
            onChange={aoDigitar}
            required
          />

          <label>Descrição</label>
          <textarea 
            className="form-control" 
            name="descricao"
            id="descricao"
            value={objLivro.descricao}
            rows="5" 
            placeholder="Digite a descrição aqui..."
            onChange={aoDigitar}>       
          </textarea>

          {/* <label>Arquivo PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files[0])}
            required
          /> */}

          {
            btnCadastrar
            ?
            <div>
              <input value="Cadastrar" type="button"  onClick={(e) => cadastrarLivro(e)} />
            </div>
            :
            <div>
              <input value="Alterar" type="button"  onClick={(e) => alterarLivro(e)} />
              <input value="Excluir" type="button"  onClick={(e) => excluirLivro(e)} />
              <input value="Cancelar" type="button"  onClick={(e) => limparFormulario(e)} />
            </div>

          }

        </form>
      </div>
      <div>
        <Tabela arrayLivros={livros} selecionar={selecionarLivro}/>
      </div>
    </div>

  );
}

export default CadastroLivro;
