import "../styles/Tabela.css";

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
        {arrayLivros.map((obj, indice) => (
          <tr key={indice}>
            <td>{indice + 1}</td>
            <td>{obj.titulo}</td>
            <td>{obj.autor}</td>
            <td>{obj.descricao}</td>
            <td>
              <a
                href={`http://localhost:8080/api/livro/download/${encodeURIComponent(obj.titulo)}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {obj.caminhoArquivo}
              </a>
            </td>
            <td>
              {obj.caminhoCapa ? (
                <img
                  src={`http://localhost:8080/api/livro/capa/${encodeURIComponent(obj.titulo)}`}
                  alt="Capa"
                  width="60"
                  height="90"
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
