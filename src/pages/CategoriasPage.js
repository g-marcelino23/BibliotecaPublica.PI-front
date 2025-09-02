import { useEffect, useState } from "react";
import apiUsuario from "../services/usuarioApi";
import BookCardCategoria from "./BookCardCategoria";
import "../styles/Carrossel.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoriasPage() {
  const [livros, setLivros] = useState({});
  const [favoritos, setFavoritos] = useState([])
  const token = localStorage.getItem("token")
  const [feedback, setFeedback] = useState({ message: "", type: "" })
  const[categorias, setCategorias] = useState([])
  const [page, setPage] = useState({});
  const [totalPages, setTotalPages] = useState({});

  useEffect(()=>{
    const fetchCategorias = async () => {
    try {
      const response = await apiUsuario.get("/categoria/getObjetoCategoria");
      console.log("Categorias carregadas:", response.data);
      setCategorias(response.data);
    } catch (err) {
      console.error("Não foi possível recuperar as categorias", err);
    }
  }
  fetchCategorias();
  },[])

  useEffect(()=>{
      const paginas = ()=>{
    if(categorias.length===0){return;}
    const paginasCategorias = {}
    for(const categoria of categorias){
      paginasCategorias[categoria.id] = 0;
    }
    setPage(paginasCategorias);
  }
  paginas();
  },[categorias])


  useEffect(()=>{
    const favoritos = async()=>{ if (token) {
          try {
            const favoritosResponse = await apiUsuario.get("livro/favoritos")
            console.log("[v0] Favoritos carregados:", favoritosResponse.data)
            const favoritosIds = favoritosResponse.data.map((livro) => livro.id)
            setFavoritos(favoritosIds)
          } catch (favoritosError) {
            console.log(
              "[v0] Erro ao carregar favoritos (não crítico):",
              favoritosError.response?.status,
              favoritosError.message,
            )
            setFavoritos([]);
          }
        }
    } 
    favoritos();
  },[token])

  useEffect(() => {
    const fetchLivrosPagination = async ()=>{
      if(categorias.length === 0 || Object.keys(page).length===0){return;}
      const livrosDict = {};
      const totalPagesDict = {}
      for(const categoria of categorias){
        try{
          const response = await apiUsuario.get(`/categoria/livrosPagination/categoria?categoria=${categoria.genero}&page=${page[categoria.id]}`)
          livrosDict[categoria.id] = response.data.content
          totalPagesDict[categoria.id] = response.data.totalPages;
        }catch(err){
          console.error("Erro ao buscar as categorias", err)
        }

      }
      setLivros(livrosDict);
      setTotalPages(totalPagesDict);
    }
    fetchLivrosPagination();
  }, [categorias, page]);



  const handleToggleFavorito = async (livroId) => {
    console.log("[v0] handleToggleFavorito chamada com ID:", livroId)
    console.log("[v0] Token disponível:", !!token)
    console.log("[v0] Token completo:", token)
    console.log("[v0] Favoritos atuais:", favoritos)

    if (!token) {
      console.log("[v0] Usuário não está logado, não pode favoritar")
      setFeedback({ message: "Você precisa estar logado para favoritar livros.", type: "error" })
      return
    }

    const isCurrentlyFavorito = favoritos.includes(livroId)
    console.log("[v0] Livro é favorito atualmente:", isCurrentlyFavorito)

    const originalFavoritos = [...favoritos]

    if (isCurrentlyFavorito) {
      setFavoritos((prev) => prev.filter((id) => id !== livroId))
    } else {
      setFavoritos((prev) => [...prev, livroId])
    }

    try {
      if (isCurrentlyFavorito) {
        console.log("[v0] Removendo dos favoritos...")
        const deleteUrl = `/livro/favoritos/${livroId}`
        console.log("[v0] URL DELETE:", deleteUrl)
        console.log("[v0] Headers DELETE:", { Authorization: `Bearer ${token}` })

        const response = await apiUsuario.delete(deleteUrl)
        console.log("[v0] Resposta DELETE:", response.status, response.data)
        setFeedback({ message: "Livro removido dos favoritos!", type: "success" })
      } else {
        console.log("[v0] Adicionando aos favoritos...")
        const postUrl = "/livro/favoritos"
        const postData = { livroId }
        const postHeaders = { Authorization: `Bearer ${token}` }
        console.log("[v0] URL POST:", postUrl)
        console.log("[v0] Data POST:", postData)
        console.log("[v0] Headers POST:", postHeaders)

        const response = await apiUsuario.post(postUrl, postData)
        console.log("[v0] Resposta POST:", response.status, response.data)
        setFeedback({ message: "Livro adicionado aos favoritos!", type: "success" })
      }
    } catch (error) {
      console.error("[v0] Erro ao atualizar favorito:", error)
      console.error("[v0] Status do erro:", error.response?.status)
      console.error("[v0] Dados do erro:", error.response?.data)
      console.error("[v0] URL da requisição que falhou:", error.config?.url)
      console.error("[v0] Método da requisição:", error.config?.method)
      console.error("[v0] Headers enviados:", error.config?.headers)
      console.error("[v0] Dados enviados:", error.config?.data)

      setFavoritos(originalFavoritos)

      if (error.response?.status === 403) {
        setFeedback({ message: "Acesso negado. Verifique se você está logado.", type: "error" })
      } else {
        setFeedback({ message: "Erro ao atualizar favoritos. Tente novamente.", type: "error" })
      }
    }
  }

  const nextPage = (categoriaId) => {
  setPage((prevPage) => {
    if (prevPage[categoriaId] < totalPages[categoriaId] - 1) {
      return {
        ...prevPage,
        [categoriaId]: prevPage[categoriaId] + 1
      };
    }
    return prevPage; // não altera se já está na última página
  });
};

const prevPage = (categoriaId) => {
  setPage((prevPage) => {
    if (prevPage[categoriaId] > 0) {
      return {
        ...prevPage,
        [categoriaId]: prevPage[categoriaId] - 1
      };
    }
    return prevPage; // não altera se já está na primeira página
  });
};


  return (
  <>
    {categorias && categorias.map(categoria => (
      <div key={categoria.id} className="carousel-wrapper">
        <h2>{categoria.genero}</h2>

        <div className="carousel-container">
          <button className="carousel-btn left" onClick={()=>prevPage(categoria.id)}>
            <ChevronLeft />
          </button>

          <div className="carousel-track">
            {livros[categoria.id] && livros[categoria.id].map(livro => (
                <BookCardCategoria
                  key={livro.id}
                  livro={livro}
                  isFavorito={favoritos.includes(livro.id)}
                  onToggleFavorito={handleToggleFavorito}
                  className="item"
                />
            ))}
          </div>

          <button className="carousel-btn right" onClick={()=>nextPage(categoria.id)}>
            <ChevronRight />
          </button>
        </div>
      </div>
    ))}
  </>
);
}
