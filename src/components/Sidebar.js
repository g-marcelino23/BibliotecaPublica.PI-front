"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import "../styles/Sidebar.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faThLarge,
  faBook,
  faPlus,
  faUser,
  faSignOutAlt,
  faChevronLeft,
  faHeart,
  faList,
  faUserEdit,
  faUsers 
} from "@fortawesome/free-solid-svg-icons"

const SidebarOption3 = ({ decoded }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <aside className={`sidebar-option3 ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-bg-pattern"></div>

      <div className="sidebar-header-opt3">
        <button className="toggle-btn-opt3" onClick={handleToggleSidebar}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      </div>

      <div className="logo-section-opt3">
        <div className="logo-circle">
          <span className="logo-emoji">📚</span>
        </div>
        <h3 className="sidebar-title-opt3">BIBLIOTECH</h3>
        <p className="sidebar-tagline">Seu acervo digital</p>
      </div>

      <nav className="sidebar-nav-opt3">
        <NavLink to="/dashboard" className="nav-link-opt3" data-text="Dashboard">
          <div className="link-content">
            <FontAwesomeIcon icon={faThLarge} className="nav-icon-opt3" />
            <span className="link-text-opt3">Dashboard</span>
          </div>
        </NavLink>

        <NavLink to="/lista-livros" className="nav-link-opt3" data-text="Meus Livros">
          <div className="link-content">
            <FontAwesomeIcon icon={faBook} className="nav-icon-opt3" />
            <span className="link-text-opt3">Meus Livros</span>
          </div>
        </NavLink>

        <NavLink to="/favoritos" className="nav-link-opt3" data-text="Meus Favoritos">
          <div className="link-content">
            <FontAwesomeIcon icon={faHeart} className="nav-icon-opt3" />
            <span className="link-text-opt3">Meus Favoritos</span>
          </div>
        </NavLink>

        <NavLink to="/categorias" className="nav-link-opt3" data-text="Categorias">
          <div className="link-content">
            <FontAwesomeIcon icon={faList} className="nav-icon-opt3" />
            <span className="link-text-opt3">Categorias</span>
          </div>
        </NavLink>
        
        {/* Este link ainda não tem uma rota no App.js */}
        <NavLink to="/autores" className="nav-link-opt3" data-text="Autores">
          <div className="link-content">
            <FontAwesomeIcon icon={faUsers} className="nav-icon-opt3" />
            <span className="link-text-opt3">Autores</span>
          </div>
        </NavLink>

        {/* SEÇÃO DO ADMIN */}
        {decoded && decoded.role === "ROLE_ADMIN" && (
          <>
            <div className="nav-divider"></div>
            <NavLink to="/cadastro-livros" className="nav-link-opt3 admin-link-opt3" data-text="Cadastrar Livro">
              <div className="link-content">
                <FontAwesomeIcon icon={faPlus} className="nav-icon-opt3" />
                <span className="link-text-opt3">Cadastrar Livro</span>
              </div>
              <span className="admin-badge">ADMIN</span>
            </NavLink>
            
            {/* AQUI ESTAVA O ERRO: O link era "/gerenciar-autores"
              CORRIGIDO para "/admin/autores" (igual ao App.js)
            */}
            <NavLink to="/admin/autores" className="nav-link-opt3 admin-link-opt3" data-text="Gerenciar Autores">
              <div className="link-content">
                <FontAwesomeIcon icon={faUserEdit} className="nav-icon-opt3" />
                <span className="link-text-opt3">Gerenciar Autores</span>
              </div>
              <span className="admin-badge">ADMIN</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer-opt3">
        <NavLink to="/perfil" className="nav-link-opt3 profile-link-opt3">
          <div className="link-content">
            <FontAwesomeIcon icon={faUser} className="nav-icon-opt3" />
            <span className="link-text-opt3">Meu Perfil</span>
          </div>
        </NavLink>

        <NavLink to="/" className="nav-link-opt3 logout-link-opt3">
          <div className="link-content">
            <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon-opt3" />
            <span className="link-text-opt3">Sair</span>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}

export default SidebarOption3