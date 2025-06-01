// src/components/Tabela.js
import "../styles/Tabela.css"; // Seu CSS

function Tabela({ arrayLivros, selecionar }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Título do Livro</th>
          <th scope="col">Autor</th>
          <th scope="col">Descrição</th>
          <th scope="col">PDF do Livro</th>
          <th scope="col">Capa do Livro</th>
          <th scope="col">Selecionar</th>
        </tr>
      </thead>
      <tbody>
        {arrayLivros && arrayLivros.map((obj, indice) => ( // Adicionada verificação para arrayLivros
          <tr key={obj.id || indice}> {/* Prioriza obj.id como chave se existir */}
            <td>{indice + 1}</td>
            <td>{obj.titulo}</td>
            <td>{obj.autor}</td>
            <td>{obj.descricao}</td> {/* Descrição mantida */}
            <td>
              {/* Link para PDF mantido - ajuste a URL se necessário */}
              {obj.caminhoArquivo ? ( // Verifica se existe caminho do arquivo
                <a
                  href={`http://localhost:8080/api/livro/download/${encodeURIComponent(obj.titulo)}`} // Ou use obj.id ou obj.caminhoArquivo se for mais apropriado para a URL
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {obj.caminhoArquivo} {/* Ou um texto como "Baixar PDF" */}
                </a>
              ) : (
                <span>PDF não disponível</span>
              )}
            </td>
            <td>
              {/* Imagem da capa mantida */}
              {obj.caminhoCapa ? (
                <img
                  src={`http://localhost:8080/api/livro/capa/${encodeURIComponent(obj.titulo)}`} // Ou use obj.id ou obj.caminhoCapa
                  alt={`Capa de ${obj.titulo}`}
                  width="60"
                  height="90"
                  style={{ objectFit: 'cover' }} // Adicionado para melhor ajuste da imagem
                />
              ) : (
                <span>Sem capa</span>
              )}
            </td>
            <td>
              <button className="btn btn-success" onClick={() => selecionar(indice)}>
                Selecionar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Tabela;