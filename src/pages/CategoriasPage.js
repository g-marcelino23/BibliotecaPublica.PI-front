import { useEffect, useState } from "react";
import apiUsuario from "../services/usuarioApi";
import BookCardCategoria from "./BookCardCategoria";
import "../styles/Carrossel.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoriasPage() {
  const [livros, setLivros] = useState({});
  const [favoritos, setFavoritos] = useState([]);
  const token = localStorage.getItem("token");
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [categorias, setCategorias] = useState([]);
  const [page, setPage] = useState({});
  const [totalPages, setTotalPages] = useState({});

  // Carrega categorias ao montar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await apiUsuario.get("/categoria/getObjetoCategoria");
        setCategorias(response.data);
      } catch (err) {
        console.error("Não foi possível recuperar as categorias", err);
      }
    };
    fetchCategorias();
  }, []);

  // Inicializa pages de cada categoria
  useEffect(() => {
    if (categorias.length === 0) return;
    const paginasCategorias = {};
    for (const categoria of categorias) {
      paginasCategorias[categoria.id] = 0;
    }
    setPage(paginasCategorias);
  }, [categorias]);

  // Carrega favoritos do usuário
  useEffect(() => {
    const favoritos = async () => {
      if (token) {
        try {
          const favoritosResponse = await apiUsuario.get("livro/favoritos");
          const favoritosIds = favoritosResponse.data.map((livro) => livro.id);
          setFavoritos(favoritosIds);
        } catch (err) {
          setFavoritos([]);
        }
      }
    };
    favoritos();
  }, [token]);

  // Carrega livros paginados de cada categoria
  useEffect(() => {
    const fetchLivrosPagination = async () => {
      if (categorias.length === 0 || Object.keys(page).length === 0) return;
      const livrosDict = {};
      const totalPagesDict = {};
      for (const categoria of categorias) {
        try {
          // Aqui assume-se que o backend SÓ entrega livros permitidos!
          const response = await apiUsuario.get(
            `/categoria/livrosPagination/categoria?categoria=${categoria.genero}&page=${page[categoria.id]}`
          );
          // Recebe paginação da API
          livrosDict[categoria.id] = response.data.content || [];
          totalPagesDict[categoria.id] = response.data.totalPages;
        } catch (err) {
          livrosDict[categoria.id] = []; // Garante lista vazia se erro
          totalPagesDict[categoria.id] = 0;
        }
      }
      setLivros(livrosDict);
      setTotalPages(totalPagesDict);
    };
    fetchLivrosPagination();
    // eslint-disable-next-line
  }, [categorias, page]);

  // Favoritar/desfavoritar
  const handleToggleFavorito = async (livroId) => {
    if (!token) {
      setFeedback({ message: "Você precisa estar logado para favoritar livros.", type: "error" });
      return;
    }
    const isCurrentlyFavorito = favoritos.includes(livroId);
    const originalFavoritos = [...favoritos];
    if (isCurrentlyFavorito) {
      setFavoritos((prev) => prev.filter((id) => id !== livroId));
    } else {
      setFavoritos((prev) => [...prev, livroId]);
    }
    try {
      if (isCurrentlyFavorito) {
        await apiUsuario.delete(`/livro/favoritos/${livroId}`);
        setFeedback({ message: "Livro removido dos favoritos!", type: "success" });
      } else {
        await apiUsuario.post("/livro/favoritos", { livroId });
        setFeedback({ message: "Livro adicionado aos favoritos!", type: "success" });
      }
    } catch (error) {
      setFavoritos(originalFavoritos);
      setFeedback({ message: "Erro ao atualizar favoritos. Tente novamente.", type: "error" });
    }
  };

  // Paginação esquerda/direita
  const nextPage = (categoriaId) => {
    setPage((prevPage) => {
      if (prevPage[categoriaId] < (totalPages[categoriaId] || 1) - 1) {
        return {
          ...prevPage,
          [categoriaId]: prevPage[categoriaId] + 1,
        };
      }
      return prevPage;
    });
  };
  const prevPage = (categoriaId) => {
    setPage((prevPage) => {
      if (prevPage[categoriaId] > 0) {
        return {
          ...prevPage,
          [categoriaId]: prevPage[categoriaId] - 1,
        };
      }
      return prevPage;
    });
  };

  // **AQUI está o filtro pra mostrar só categorias com livros**
  const categoriasComLivros = categorias.filter(
    (categoria) => livros[categoria.id] && livros[categoria.id].length > 0
  );

  return (
    <>
      {/* Mensagem caso não sobre nenhuma categoria para o usuário */}
      {categoriasComLivros.length === 0 && (
        <div style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
          Nenhum livro disponível para sua classificação indicativa.
        </div>
      )}
      {categoriasComLivros.map((categoria) => (
        <div key={categoria.id} className="carousel-wrapper">
          <h2>{categoria.genero}</h2>
          <div className="carousel-container">
            <button className="carousel-btn left" onClick={() => prevPage(categoria.id)}>
              <ChevronLeft />
            </button>
            <div className="carousel-track">
              {livros[categoria.id] &&
                livros[categoria.id].map((livro) => (
                  <BookCardCategoria
                    key={livro.id}
                    livro={livro}
                    isFavorito={favoritos.includes(livro.id)}
                    onToggleFavorito={handleToggleFavorito}
                    className="item"
                  />
                ))}
            </div>
            <button className="carousel-btn right" onClick={() => nextPage(categoria.id)}>
              <ChevronRight />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
