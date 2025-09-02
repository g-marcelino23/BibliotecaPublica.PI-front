"use client"

import { useState, useEffect } from "react"
import { FaStar } from "react-icons/fa"
import { jwtDecode } from "jwt-decode"
import "../styles/BookCard.css"

const BookCardCategoria = ({ livro, isFavorito, onToggleFavorito }) => {
  const [decoded, setDecoded] = useState()
  const defaultCover = "https://picsum.photos/120/180?grayscale&text=Sem+Capa"

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const decoded = jwtDecode(token)
      setDecoded(decoded)
    }
  }, [])

  const capaUrl = livro.caminhoCapa
    ? `http://localhost:8080/api/livro/capa/${encodeURIComponent(livro.titulo)}`
    : defaultCover

  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = defaultCover
  }

  return (
    <div className="book-card">
      <FaStar
        className={`favorite-star ${isFavorito ? "favorited" : ""}`}
        onClick={() => onToggleFavorito && onToggleFavorito(livro.id)}
        title={isFavorito ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
      />

      <img
        src={capaUrl || "/placeholder.svg"}
        alt={`Capa de ${livro.titulo}`}
        className="book-card-cover"
        onError={handleImageError}
      />

      <div className="book-card-info">
        <h3 className="book-card-title">{livro.titulo}</h3>
      </div>

      {livro.caminhoArquivo && (
          <a
            href={`http://localhost:8080/api/livro/download/${encodeURIComponent(livro.titulo)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="book-card-pdf-link"
          >
            Baixar PDF ({livro.caminhoArquivo})
          </a>
        )}

    </div>
  )
}

export default BookCardCategoria
