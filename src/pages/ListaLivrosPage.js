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
        if (!token) throw new Error("Token não encontrado.");

        const livrosResponse = await api.get("/api/livro/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLivros(livrosResponse.data || [])
        
        try {
          const favoritosResponse = await api.get("/api/livro/favoritos", {
            headers: { Authorization: `Bearer ${token}` },
          })
          const favoritosIds = favoritosResponse.data.map((livro) => livro.id)
          setFavoritos(favoritosIds)
        } catch (e) { setFavoritos([]) }
      } catch (err) {
        console.error(err)
        setFeedback({ message: "Erro ao carregar livros.", type: "error" })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  const livrosFiltrados = livros.filter((livro) => {
    const buscaLower = busca.toLowerCase()
    return (
        (livro.titulo && livro.titulo.toLowerCase().includes(buscaLower)) ||
        (livro.autor && livro.autor.nome && livro.autor.nome.toLowerCase().includes(buscaLower))
    )
  })

  useEffect(() => {
    const buscarExternos = async () => {
      const filtrados = livros.filter((livro) => {
        const buscaLower = busca.toLowerCase()
        return (livro.titulo && livro.titulo.toLowerCase().includes(buscaLower))
      })

      if (busca.trim().length > 2 && filtrados.length === 0 && !buscandoExterno) {
        setBuscandoExterno(true)
        try {
          const resultados = await buscarLivrosExternos(busca, 5)
          const livrosArray = Array.isArray(resultados?.livros) ? resultados.livros : []
          setLivrosExternos(livrosArray)
        } catch (error) {
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

  const handleToggleFavorito = async (livroId) => { /* logica igual */ }
  const handleEditBook = (livroId) => navigate(`/editar/${livroId}`)
  const handleDeleteBook = async (livroId, livroTitulo) => { /* logica igual */ }

  if (loading) return <Loading />

  return (
    <div>
      <h2 className="text-center mt-4 mb-4">Nossa Coleção de Livros</h2>

      <div className="search-container mb-4">
        <input
          type="text"
          placeholder="Buscar..."
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

      {/* 1. LISTA DE LIVROS INTERNOS (LOCAL) */}
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
        ) : null /* Se não tiver livros internos, não mostramos nada AQUI dentro */}
      </div>

      {/* 2. ÁREA EXTERNA (FORA DA 'book-list-container') */}
      {/* Isso garante que ela ocupe a tela toda e não fique presa no grid de cima */}
      {livrosFiltrados.length === 0 && busca.trim().length > 0 && (
          <div className="text-center mt-4" style={{width: '100%', padding: '20px'}}>
            {buscandoExterno ? (
              <p>Buscando em catálogos externos...</p>
            ) : livrosExternos.length > 0 ? (
              <div style={{width: '100%'}}>
                <p className="mb-3">Não encontramos "<strong>{busca}</strong>" em nossa biblioteca.</p>
                <p className="mb-4">Mas encontramos estas opções externas:</p>
                
                {/* --- GRID DE LIVROS EXTERNOS --- */}
                <div style={{
                    display: "grid",
                    /* Grid responsivo que se ajusta automaticamente */
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "20px",
                    width: "100%",
                    maxWidth: "1200px", /* Limita a largura máxima para não esticar demais */
                    margin: "0 auto"    /* Centraliza o bloco na tela */
                }}>
                  {livrosExternos.map((livroExterno, index) => (
                    
                    <div key={index} style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '15px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: '1px solid #e0e0e0',
                        height: '100%',
                        textAlign: 'left'
                    }}>
                      
                      {/* Imagem */}
                      <div style={{ textAlign: 'center', marginBottom: '15px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', borderRadius: '8px' }}>
                          {livroExterno.urlCapaMedia ? (
                              <img 
                                src={livroExterno.urlCapaMedia} 
                                alt={livroExterno.titulo} 
                                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
                              />
                          ) : (
                              <span style={{color: '#999'}}>Sem Capa</span>
                          )}
                      </div>

                      {/* Info */}
                      <div style={{ marginBottom: '10px' }}>
                          <h5 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                            {livroExterno.titulo}
                          </h5>
                          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
                            <strong>Autor:</strong> {livroExterno.primeiroAutor || "Desconhecido"}
                          </p>
                          {livroExterno.primeiroAno && (
                              <p style={{ fontSize: '0.85rem', color: '#777' }}>
                                <strong>Ano:</strong> {livroExterno.primeiroAno}
                              </p>
                          )}
                      </div>

                      {/* Botão */}
                      <a 
                          href={livroExterno.linkCompraAmazon} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                              display: 'block',
                              width: '100%',
                              backgroundColor: '#FF9900',
                              color: 'white',
                              textAlign: 'center',
                              padding: '10px',
                              borderRadius: '6px',
                              textDecoration: 'none',
                              fontWeight: 'bold',
                              marginTop: 'auto',
                              fontSize: '0.9rem'
                          }}
                      >
                          Comprar na Amazon
                      </a>
                    </div>
                  ))}
                </div>
                {/* --- FIM GRID --- */}
                
              </div>
            ) : (
              <p>Nenhum livro encontrado em nossa biblioteca ou em catálogos externos.</p>
            )}
          </div>
      )}
      
      {livrosFiltrados.length === 0 && busca.trim().length === 0 && (
          <p className="text-center mt-4">Digite algo para buscar livros.</p>
      )}

    </div>
  )
}

export default ListaLivrosPage