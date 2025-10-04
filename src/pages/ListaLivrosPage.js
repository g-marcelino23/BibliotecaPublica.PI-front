"use client"

// src/components/ListaLivrosPage.js
import { useEffect, useState } from "react"
import api from "../services/api.js"
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log("[v0] Iniciando busca de livros...")
        console.log("[v0] Token disponível:", !!token)

        const endpointsParaTestar = ["/all", "/", "/livro", "/livros", "/listar", "/buscar"]

        let livrosResponse
        let endpointFuncionou = null

        for (const endpoint of endpointsParaTestar) {
          try {
            console.log(`[v0] Testando endpoint: ${endpoint}`)

            // Primeiro tenta sem token
            try {
              livrosResponse = await api.get(endpoint)
              console.log(`[v0] SUCESSO sem token no endpoint: ${endpoint}`)
              endpointFuncionou = endpoint
              break
            } catch (error) {
              console.log(`[v0] Falhou sem token no ${endpoint}, tentando com token...`)

              // Se falhou sem token, tenta com token
              if (token) {
                livrosResponse = await api.get(endpoint, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                console.log(`[v0] SUCESSO com token no endpoint: ${endpoint}`)
                endpointFuncionou = endpoint
                break
              }
            }
          } catch (error) {
            console.log(`[v0] Endpoint ${endpoint} falhou:`, error.response?.status, error.message)
          }
        }

        if (!endpointFuncionou) {
          throw new Error("Nenhum endpoint funcionou")
        }

        console.log("[v0] Livros carregados:", livrosResponse.data)
        console.log("[v0] Quantidade de livros:", livrosResponse.data?.length || 0)
        setLivros(livrosResponse.data || [])

        if (token) {
          try {
            const favoritosResponse = await api.get("/favoritos", {
              headers: { Authorization: `Bearer ${token}` },
            })
            console.log("[v0] Favoritos carregados:", favoritosResponse.data)
            const favoritosIds = favoritosResponse.data.map((livro) => livro.id)
            setFavoritos(favoritosIds)
          } catch (favoritosError) {
            console.log(
              "[v0] Erro ao carregar favoritos (não crítico):",
              favoritosError.response?.status,
              favoritosError.message,
            )
            setFavoritos([])
          }
        }

        setFeedback({ message: "", type: "" })
      } catch (err) {
        console.error("[v0] Erro ao buscar livros:", err)
        console.error("[v0] Status do erro:", err.response?.status)
        console.error("[v0] Mensagem do erro:", err.response?.data || err.message)

        if (err.response?.status === 403) {
          setFeedback({ message: "Acesso negado. Verifique se você está logado corretamente.", type: "error" })
        } else if (err.response?.status === 404) {
          setFeedback({ message: "Endpoint não encontrado. Verifique a configuração da API.", type: "error" })
        } else {
          setFeedback({
            message: "Falha ao carregar a lista de livros. Verifique se o servidor está rodando.",
            type: "error",
          })
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

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
        const deleteUrl = `/favoritos/${livroId}`
        console.log("[v0] URL DELETE:", deleteUrl)
        console.log("[v0] Headers DELETE:", { Authorization: `Bearer ${token}` })

        const response = await api.delete(deleteUrl, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log("[v0] Resposta DELETE:", response.status, response.data)
        setFeedback({ message: "Livro removido dos favoritos!", type: "success" })
      } else {
        console.log("[v0] Adicionando aos favoritos...")
        const postUrl = "/favoritos"
        const postData = { livroId }
        const postHeaders = { Authorization: `Bearer ${token}` }
        console.log("[v0] URL POST:", postUrl)
        console.log("[v0] Data POST:", postData)
        console.log("[v0] Headers POST:", postHeaders)

        const response = await api.post(postUrl, postData, {
          headers: postHeaders,
        })
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

  const handleEditBook = (livroId) => {
    navigate(`/editar/${livroId}`)
  }

  const handleDeleteBook = async (livroId, livroTitulo) => {
    if (window.confirm(`Tem certeza que deseja excluir o livro "${livroTitulo}"?`)) {
      try {
        await api.delete(`/deletar/${livroId}`, { headers: { Authorization: `Bearer ${token}` } })
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
    const autorMatch = livro.autor && livro.autor.toLowerCase().includes(buscaLower)

    // Busca por categoria (pode ser objeto ou string)
    let categoriaMatch = false
    if (livro.categoria) {
      if (typeof livro.categoria === "string") {
        categoriaMatch = livro.categoria.toLowerCase().includes(buscaLower)
      } else if (livro.categoria.genero) {
        categoriaMatch = livro.categoria.genero.toLowerCase().includes(buscaLower)
      } else if (livro.categoria.nome) {
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
