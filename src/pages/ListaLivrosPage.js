"use client"

// src/components/ListaLivrosPage.js
import { useEffect, useState } from "react"
import api from "../services/api.js" // Este é o api.js com baseURL 'http://localhost:8080'
import BookCard from "./BookCard.js"
import { useNavigate } from "react-router-dom"
import "../styles/BookCard.css"
import Loading from "../components/Loading.js"

function ListaLivrosPage() {
  const [livros, setLivros] = useState([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState({ message: "", type: "" })
  const [favoritos, setFavoritos] = useState([])
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  // --- O useEffect FOI TOTALMENTE CORRIGIDO ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setFeedback({ message: "", type: "" }) // Limpa erros antigos

        if (!token) {
          // Se não tem token, nem tenta buscar (assumindo que /all é protegido)
           throw new Error("Token não encontrado. Faça o login.");
        }
        
        // 1. CHAMA O ENDPOINT CORRETO
        // O endpoint /api/livro/all no seu backend filtra por idade
        const livrosResponse = await api.get("/api/livro/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("[v1] SUCESSO com token no endpoint: /api/livro/all")
        console.log("[v1] Quantidade de livros:", livrosResponse.data?.length || 0)
        setLivros(livrosResponse.data || [])

        // 2. Busca os favoritos (esta parte já estava correta, mas precisa do prefixo)
        try {
          const favoritosResponse = await api.get("/api/livro/favoritos", {
            headers: { Authorization: `Bearer ${token}` },
          })
          console.log("[v1] Favoritos carregados:", favoritosResponse.data)
          const favoritosIds = favoritosResponse.data.map((livro) => livro.id)
          setFavoritos(favoritosIds)
        } catch (favoritosError) {
          console.log("[v1] Erro ao carregar favoritos (não crítico):", favoritosError.message)
          setFavoritos([])
        }

      } catch (err) {
        console.error("[v1] Erro ao buscar livros:", err)
        if (err.response?.status === 400) {
            // ESTE É O ERRO DA DATA DE NASCIMENTO NULA
            setFeedback({ message: "Erro ao carregar livros. Verifique se sua Data de Nascimento está cadastrada no Perfil.", type: "error" })
        } else if (err.response?.status === 403) {
            setFeedback({ message: "Acesso negado. Faça o login novamente.", type: "error" })
        } else {
            setFeedback({ message: "Falha ao carregar a lista de livros.", type: "error" })
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  // --- O handleToggleFavorito PRECISA DOS PREFIXOS /api/livro ---
  const handleToggleFavorito = async (livroId) => {
    if (!token) {
      setFeedback({ message: "Você precisa estar logado para favoritar livros.", type: "error" })
      return
    }

    const isCurrentlyFavorito = favoritos.includes(livroId)
    const originalFavoritos = [...favoritos]

    // Otimista: atualiza a UI primeiro
    if (isCurrentlyFavorito) {
      setFavoritos((prev) => prev.filter((id) => id !== livroId))
    } else {
      setFavoritos((prev) => [...prev, livroId])
    }

    try {
      if (isCurrentlyFavorito) {
        // CORREÇÃO: Adicionado /api/livro
        const deleteUrl = `/api/livro/favoritos/${livroId}`
        await api.delete(deleteUrl, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setFeedback({ message: "Livro removido dos favoritos!", type: "success" })
      } else {
        // CORREÇÃO: Adicionado /api/livro
        const postUrl = "/api/livro/favoritos"
        const postData = { livroId } // Seu backend espera {livroId}? Confirme isso.
        await api.post(postUrl, postData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setFeedback({ message: "Livro adicionado aos favoritos!", type: "success" })
      }
    } catch (error) {
      console.error("[v1] Erro ao atualizar favorito:", error)
      setFavoritos(originalFavoritos) // Reverte a mudança
      setFeedback({ message: "Erro ao atualizar favoritos.", type: "error" })
    }
  }

  const handleEditBook = (livroId) => {
    navigate(`/editar/${livroId}`)
  }

  // --- O handleDeleteBook PRECISA DO PREFIXO /api/livro ---
  const handleDeleteBook = async (livroId, livroTitulo) => {
    if (window.confirm(`Tem certeza que deseja excluir o livro "${livroTitulo}"?`)) {
      try {
        // CORREÇÃO: Adicionado /api/livro
        await api.delete(`/api/livro/deletar/${livroId}`, { headers: { Authorization: `Bearer ${token}` } })
        setLivros((prevLivros) => prevLivros.filter((livro) => livro.id !== livroId))
        setFeedback({ message: `Livro "${livroTitulo}" excluído com sucesso!`, type: "success" })
      } catch (error) {
        console.error("Erro ao excluir livro:", error)
        setFeedback({ message: "Erro ao excluir livro.", type: "error" })
      }
    }
  }

  const livrosFiltrados = livros.filter((livro) => {
    const buscaLower = busca.toLowerCase()
    const tituloMatch = livro.titulo && livro.titulo.toLowerCase().includes(buscaLower)
    
    // CORREÇÃO: O autor agora é um objeto
    const autorMatch = livro.autor && livro.autor.nome && livro.autor.nome.toLowerCase().includes(buscaLower)

    let categoriaMatch = false
    if (livro.categoria) {
      // CORREÇÃO: A categoria agora é um objeto
      if (livro.categoria.genero) {
        categoriaMatch = livro.categoria.genero.toLowerCase().includes(buscaLower)
      } else if (livro.categoria.nome) { // Fallback
        categoriaMatch = livro.categoria.nome.toLowerCase().includes(buscaLower)
      }
    }

    return tituloMatch || autorMatch || categoriaMatch
  })

  if (loading) return <Loading />

  return (
    <div>
      <h2 className="text-center mt-4 mb-4 ">Nossa Coleção de Livros</h2>

      <div className="search-container mb-4">
        <input
          type="text"
          placeholder="Buscar por título, autor ou categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="form-control search-input"
        />
      </div>

      {feedback.message && (
        <div className={`alert ${feedback.type === "success" ? "alert-success" : "alert-danger"} text-center`}>
          {feedback.message}
        </div>
      )}

      <div className="book-list-container">
        {livrosFiltrados.length > 0 ? (
          livrosFiltrados.map((livro) => (
            <BookCard
              key={livro.id}
              livro={livro}
              onEdit={() => handleEditBook(livro.id)}
              onDelete={() => handleDeleteBook(livro.id, livro.titulo)}
              isFavorito={favoritos.includes(livro.id)}
              onToggleFavorito={handleToggleFavorito}
            />
          ))
        ) : (
          <p className="text-center mt-4">Nenhum livro encontrado.</p>
        )}
      </div>
    </div>
  )
}

export default ListaLivrosPage