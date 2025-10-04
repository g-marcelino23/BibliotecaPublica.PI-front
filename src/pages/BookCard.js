"use client"
import { useState, useEffect } from "react"
import { FaStar, FaDownload, FaEdit, FaTrash } from "react-icons/fa"
import { jwtDecode } from "jwt-decode"
import "../styles/BookCard.css"

const classificacaoInfo = {
  L: { label: "L", cor: "#3ec300", bg: "#cdf5cb" },
  DEZ: { label: "10", cor: "#0260de", bg: "#b5d5fa" },
  DOZE: { label: "12", cor: "#ffd600", bg: "#fff9c1" },
  QUATORZE: { label: "14", cor: "#ff9800", bg: "#ffe5be" },
  DEZESSEIS: { label: "16", cor: "#e42c27", bg: "#ffc2bf" },
  DEZOITO: { label: "18", cor: "#fff", bg: "#222" },
}

function getClassificacaoBadgeProps(valor) {
  const props = classificacaoInfo[(valor || "").toUpperCase()]
  if (!props) return { label: valor || "-", cor: "#888", bg: "#ececec" }
  return props
}

const BookCard = ({ livro, onEdit, onDelete, isFavorito, onToggleFavorito }) => {
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

  const cls = getClassificacaoBadgeProps(livro.classificacaoIndicativa)

  return (
    <div className="book-card-dark">
      <div className="book-card-cover-wrapper">
        <img
          src={capaUrl || "/placeholder.svg"}
          alt={`Capa de ${livro.titulo}`}
          className="book-card-cover-dark"
          onError={handleImageError}
        />
        <div className="book-card-overlay">
          {livro.classificacaoIndicativa && (
            <span
              className="book-card-badge-dark"
              style={{
                color: cls.cor,
                background: cls.bg,
                fontWeight: "bold",
              }}
              title="Classificação indicativa"
            >
              {cls.label}
            </span>
          )}
          <FaStar
            className={`favorite-star-dark ${isFavorito ? "favorited" : ""}`}
            onClick={() => onToggleFavorito && onToggleFavorito(livro.id)}
            title={isFavorito ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
          />
        </div>
      </div>

      <div className="book-card-content-dark">
        {livro.categoria && (
          <span className="book-card-category-dark">
            {typeof livro.categoria === "string"
              ? livro.categoria
              : livro.categoria.genero || livro.categoria.nome || "Sem categoria"}
          </span>
        )}
        <h3 className="book-card-title-dark">{livro.titulo}</h3>
        <p className="book-card-author-dark">{livro.autor}</p>
        <p className="book-card-description-dark">{livro.descricao || "Sem descrição."}</p>

        {livro.caminhoArquivo && (
          <a
            href={`http://localhost:8080/api/livro/download/${encodeURIComponent(livro.titulo)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="book-card-download-dark"
          >
            <FaDownload /> Baixar PDF
          </a>
        )}
      </div>

      {decoded && decoded.role === "ROLE_ADMIN" && (
        <div className="book-card-actions-dark">
          <button onClick={() => onEdit(livro.id)} className="book-card-btn-dark edit">
            <FaEdit /> Editar
          </button>
          <button onClick={() => onDelete(livro.id, livro.titulo)} className="book-card-btn-dark delete">
            <FaTrash /> Excluir
          </button>
        </div>
      )}
    </div>
  )
}

export default BookCard
