"use client"

import { useEffect, useState } from "react"
import api from "../services/api.js"
import { buscarLivrosExternos } from "../services/externalBookApi.js"
import BookCard from "./BookCard.js"
import { useNavigate } from "react-router-dom"
import "../styles/BookCard.css"
import Loading from "../components/Loading.js"

function ListaLivrosPage() {
  const [livros, setLivros] = useState([])
  const [livrosExternos, setLivrosExternos] = useState([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)
  const [buscandoExterno, setBuscandoExterno] = useState(false)
  const [feedback, setFeedback] = useState({ message: "", type: "" })
  const [favoritos, setFavoritos] = useState([])
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setFeedback({ message: "", type: "" })

        if (!token) {
          throw new Error("Token não encontrado. Faça o login.");
        }

        const livrosResponse = await api.get("/api/livro/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("[v1] SUCESSO com token no endpoint: /api/livro/all")
        console.log("[v1] Quantidade de livros:", livrosResponse.data?.length || 0)
        setLivros(livrosResponse.data || [])

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

  const livrosFiltrados = livros.filter((livro) => {
    const buscaLower = busca.toLowerCase()
    const tituloMatch = livro.titulo && livro.titulo.toLowerCase().includes(buscaLower)
    const autorMatch = livro.autor && livro.autor.nome && livro.autor.nome.toLowerCase().includes(buscaLower)
    let categoriaMatch = false
    if (livro.categoria) {
      if (livro.categoria.genero) {
        categoriaMatch = livro.categoria.genero.toLowerCase().includes(buscaLower)
      } else if (livro.categoria.nome) {
        categoriaMatch = livro.categoria.nome.toLowerCase().includes(buscaLower)
      }
    }
    return tituloMatch || autorMatch || categoriaMatch
  })

  // NOVA FUNÇÃO: Busca externa quando não encontrar livros locais
 useEffect(() => {
  const buscarExternos = async () => {
      // Calcula livrosFiltrados DENTRO do useEffect
      const filtrados = livros.filter((livro) => {
        const buscaLower = busca.toLowerCase()
        const tituloMatch = livro.titulo && livro.titulo.toLowerCase().includes(buscaLower)
        const autorMatch = livro.autor && livro.autor.nome && livro.autor.nome.toLowerCase().includes(buscaLower)
        let categoriaMatch = false
        if (livro.categoria) {
          if (livro.categoria.genero) {
            categoriaMatch = livro.categoria.genero.toLowerCase().includes(buscaLower)
          } else if (livro.categoria.nome) {
            categoriaMatch = livro.categoria.nome.toLowerCase().includes(buscaLower)
          }
        }
        return tituloMatch || autorMatch || categoriaMatch
      })

      // Só busca se tiver algo digitado e não encontrou nada localmente
      if (busca.trim().length > 2 && filtrados.length === 0 && !buscandoExterno) {
        setBuscandoExterno(true)
        try {
          console.log("🔍 Buscando externamente:", busca)
          const resultados = await buscarLivrosExternos(busca, 5)

          console.log("📦 RESULTADOS COMPLETOS:", resultados)
          console.log("📚 LIVROS:", resultados?.livros)
          console.log("🔢 QUANTIDADE:", resultados?.livros?.length)

          const livrosArray = Array.isArray(resultados?.livros) ? resultados.livros : []
          console.log("✅ Setando livros externos:", livrosArray.length, "livros")
          setLivrosExternos(livrosArray)
        } catch (error) {
          console.error("❌ Erro ao buscar livros externos:", error)
          setLivrosExternos([])
        } finally {
          setBuscandoExterno(false)
        }
      } else if (busca.trim().length <= 2) {
        setLivrosExternos([])
      }
    }

    const timeoutId = setTimeout(buscarExternos, 500)
    return () => clearTimeout(timeoutId)
  }, [busca, livros]) 


  const handleToggleFavorito = async (livroId) => {
    if (!token) {
      setFeedback({ message: "Você precisa estar logado para favoritar livros.", type: "error" })
      return
    }

    const isCurrentlyFavorito = favoritos.includes(livroId)
    const originalFavoritos = [...favoritos]

    if (isCurrentlyFavorito) {
      setFavoritos((prev) => prev.filter((id) => id !== livroId))
    } else {
      setFavoritos((prev) => [...prev, livroId])
    }

    try {
      if (isCurrentlyFavorito) {
        const deleteUrl = `/api/livro/favoritos/${livroId}`
        await api.delete(deleteUrl, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setFeedback({ message: "Livro removido dos favoritos!", type: "success" })
      } else {
        const postUrl = "/api/livro/favoritos"
        const postData = { livroId }
        await api.post(postUrl, postData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setFeedback({ message: "Livro adicionado aos favoritos!", type: "success" })
      }
    } catch (error) {
      console.error("[v1] Erro ao atualizar favorito:", error)
      setFavoritos(originalFavoritos)
      setFeedback({ message: "Erro ao atualizar favoritos.", type: "error" })
    }
  }

  const handleEditBook = (livroId) => {
    navigate(`/editar/${livroId}`)
  }

  const handleDeleteBook = async (livroId, livroTitulo) => {
    if (window.confirm(`Tem certeza que deseja excluir o livro "${livroTitulo}"?`)) {
      try {
        await api.delete(`/api/livro/deletar/${livroId}`, { headers: { Authorization: `Bearer ${token}` } })
        setLivros((prevLivros) => prevLivros.filter((livro) => livro.id !== livroId))
        setFeedback({ message: `Livro "${livroTitulo}" excluído com sucesso!`, type: "success" })
      } catch (error) {
        console.error("Erro ao excluir livro:", error)
        setFeedback({ message: "Erro ao excluir livro.", type: "error" })
      }
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <h2 className="text-center mt-4 mb-4">Nossa Coleção de Livros</h2>

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
        ) : busca.trim().length > 0 ? (
          <div className="text-center mt-4">
            {buscandoExterno ? (
              <p>Buscando em catálogos externos...</p>
            ) : livrosExternos.length > 0 ? (
              <div>
                <p className="mb-3">
                  Não encontramos "<strong>{busca}</strong>" em nossa biblioteca.
                </p>
                <p className="mb-4">
                  Mas encontramos estas opções externas. Você pode comprá-las na Amazon:
                </p>
                <div className="external-books-wrapper">
                  <div className="external-books-container">
                    {livrosExternos.map((livroExterno, index) => (
                      <div key={index} className="external-book-card card mb-3">
                        <div className="row g-0">
                          {livroExterno.urlCapaMedia && (
                            <div className="col-md-3">
                              <img 
                                src={livroExterno.urlCapaMedia} 
                                alt={livroExterno.titulo}
                                className="img-fluid rounded-start"
                                style={{ maxHeight: '200px', objectFit: 'cover' }}
                              />
                            </div>
                          )}
                          <div className={livroExterno.urlCapaMedia ? "col-md-9" : "col-md-12"}>
                            <div className="card-body">
                              <h5 className="card-title">{livroExterno.titulo}</h5>
                              <p className="card-text">
                                <strong>Autor:</strong> {livroExterno.primeiroAutor}
                              </p>
                              {livroExterno.primeiroAno && (
                                <p className="card-text">
                                  <strong>Ano:</strong> {livroExterno.primeiroAno}
                                </p>
                              )}
                              {livroExterno.numeroPaginas && (
                                <p className="card-text">
                                  <strong>Páginas:</strong> {livroExterno.numeroPaginas}
                                </p>
                              )}
                              <a 
                                href={livroExterno.linkCompraAmazon} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                              >
                                Comprar na Amazon
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p>Nenhum livro encontrado em nossa biblioteca ou em catálogos externos.</p>
            )}
          </div>
        ) : (
          <p className="text-center mt-4">Digite algo para buscar livros.</p>
        )}
      </div>
    </div>
  )
}

export default ListaLivrosPage
