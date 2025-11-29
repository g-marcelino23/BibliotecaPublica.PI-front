// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import FavoritosPage from './pages/FavoritosPage';
import AccessibilityControls from './components/AccessibilityControls';
import Home from './pages/Home';
import CadastroUsuario from './pages/CadastroUsuario';
import LoginUsuario from './pages/LoginUsuario';
import Dashboard from './pages/Dashboard';
import ListaLivrosPage from './pages/ListaLivrosPage';
import CadastroLivros from './pages/CadastroLivros';
import Perfil from './pages/Perfil';
import CategoriasPage from './pages/CategoriasPage';
import GerenciarAutores from './pages/GerenciarAutores';
import AutoresListPage from './pages/AutoresListPage';
import AutorDetailPage from './pages/AutorDetailPage';

function App() {
  return (
    <Router>
      <AccessibilityControls />
      <Routes>
        {/* --- ROTAS PÚBLICAS (Sem Sidebar e Sem Assistente) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login-usuario" element={<LoginUsuario />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />

        {/* --- ROTAS PRIVADAS (Com Sidebar e Assistente) --- */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/lista-livros"
          element={
            <Layout>
              <ListaLivrosPage />
            </Layout>
          }
        />
        <Route
          path="/cadastro-livros"
          element={
            <Layout>
              <CadastroLivros />
            </Layout>
          }
        />
        <Route
          path="/editar/:livroId"
          element={
            <Layout>
              <CadastroLivros />
            </Layout>
          }
        />
        <Route
          path="/perfil"
          element={
            <Layout>
              <Perfil />
            </Layout>
          }
        />
        <Route
          path="/favoritos"
          element={
            <Layout>
              <FavoritosPage />
            </Layout>
          }
        />
        <Route
          path="/categorias"
          element={
            <Layout>
              <CategoriasPage />
            </Layout>
          }
        />
        <Route
          path="/admin/autores"
          element={
            <Layout>
              <GerenciarAutores />
            </Layout>
          }
        />
        <Route
          path="/autores"
          element={
            <Layout>
              <AutoresListPage />
            </Layout>
          }
        />
        <Route
          path="/autores/:id"
          element={
            <Layout>
              <AutorDetailPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
