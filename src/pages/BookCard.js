"use client"
import { useState, useEffect } from "react"
import { FaStar } from "react-icons/fa"
import { jwtDecode } from "jwt-decode"
import "../styles/BookCard.css"

// Função utilitária para cor e label:
const classificacaoInfo = {
  L:        { label: "L",  cor: "#3ec300", bg: "#cdf5cb" },       // Verde
  DEZ:      { label: "10", cor: "#0260de", bg: "#b5d5fa" },       // Azul
  DOZE:     { label: "12", cor: "#ffd600", bg: "#fff9c1" },       // Amarelo
  QUATORZE: { label: "14", cor: "#ff9800", bg: "#ffe5be" },       // Laranja
  DEZESSEIS:{ label: "16", cor: "#e42c27", bg: "#ffc2bf" },       // Vermelho
  DEZOITO:  { label: "18", cor: "#fff",    bg: "#222" }           // Preto badge, texto branco!
}
function getClassificacaoBadgeProps(valor) {
  const props = classificacaoInfo[(valor || '').toUpperCase()]
  if (!props) return { label: valor || '-', cor: "#888", bg: "#ececec" }
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
  // PEGA PROPRIEDADES DA CLASSIFICAÇÃO
  const cls = getClassificacaoBadgeProps(livro.classificacaoIndicativa)

  return (
    <div className="book-card">
      <FaStar
        className={`favorite-star ${isFavorito ? "favorited" : ""}`}
        onClick={() => onToggleFavorito && onToggleFavorito(livro.id)}
        title={isFavorito ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
      />

      {/* BADGE DE CLASSIFICAÇÃO */}
      {livro.classificacaoIndicativa && (
        <span
          className="book-card-badge"
          style={{
            color: getClassificacaoBadgeProps(livro.classificacaoIndicativa).cor,
            background: getClassificacaoBadgeProps(livro.classificacaoIndicativa).bg,
            border: `2px solid ${getClassificacaoBadgeProps(livro.classificacaoIndicativa).bg}`,
            fontWeight: "bold"
          }}
          title={"Classificação indicativa"}
        >
          {getClassificacaoBadgeProps(livro.classificacaoIndicativa).label}
        </span>
      )}


      <img
        src={capaUrl || "/placeholder.svg"}
        alt={`Capa de ${livro.titulo}`}
        className="book-card-cover"
        onError={handleImageError}
      />
      <div className="book-card-info">
        <h3 className="book-card-title">{livro.titulo}</h3>
        <p className="book-card-author">Por: {livro.autor}</p>
        <p className="book-card-description">{livro.descricao || "Sem descrição."}</p>
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
      {decoded && decoded.role === "ROLE_ADMIN" && (
        <div className="book-card-actions">
          <button onClick={() => onEdit(livro.id)} className="book-card-button edit">
            Editar
          </button>
          <button onClick={() => onDelete(livro.id, livro.titulo)} className="book-card-button delete">
            Excluir
          </button>
        </div>
      )}
    </div>
  )
}
export default BookCard
