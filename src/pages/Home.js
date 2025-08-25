"use client"

import { useState } from "react"
import "../styles/Home.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaUserPlus,
  FaSignInAlt,
  FaBook,
  FaBookOpen,
  FaGraduationCap,
  FaUsers,
} from "react-icons/fa"

function Home() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerRole, setRegisterRole] = useState("USER")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  document.title = `Biblioteca Virtual | ${isRegistering ? "Cadastro" : "Login"}`

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      })
      const { token, name: userName } = response.data
      localStorage.setItem("token", token)
      localStorage.setItem("userName", userName)
      navigate("/dashboard")
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("E-mail ou senha inválidos. Tente novamente.")
      }
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role: registerRole,
      })
      const { token, name: userName } = response.data
      localStorage.setItem("token", token)
      localStorage.setItem("userName", userName)
      navigate("/dashboard")
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("Erro ao registrar. Verifique os dados e tente novamente.")
      }
    }
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="video-section">
          <video className="background-video" autoPlay muted loop playsInline>
            <source src="/assets/videos/home.mp4" type="video/mp4" />
            Seu navegador não suporta vídeos HTML5.
          </video>

          <div className="video-overlay">
            <div className="brand-content">
              <div className="library-logo">
                <FaBookOpen className="logo-icon" />
                <h1>BiblioTech</h1>
              </div>
              <div className="brand-info">
                <h2>Biblioteca Virtual</h2>
                <p>
                  Acesse o maior acervo digital de conhecimento. Explore livros, artigos acadêmicos, pesquisas e
                  recursos educacionais em um ambiente seguro e organizado.
                </p>
                <div className="features-list">
                  <div className="feature-item">
                    <FaBook className="feature-icon" />
                    <span>Acervo Digital</span>
                  </div>
                  <div className="feature-item">
                    <FaGraduationCap className="feature-icon" />
                    <span>Recursos Acadêmicos</span>
                  </div>
                  <div className="feature-item">
                    <FaUsers className="feature-icon" />
                    <span>Comunidade Estudantil</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          {!isRegistering ? (
            <form onSubmit={handleLogin} className="auth-form animate">
              <div className="form-header">
                <FaSignInAlt className="form-icon" />
                <h2>Acesso à Biblioteca</h2>
                <p>Entre com suas credenciais de estudante</p>
              </div>
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="E-mail acadêmico"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Senha"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert-message error">{error}</div>}
              <button type="submit" className="btn btn-primary">
                Acessar Biblioteca
              </button>
              <p className="switch-form-text">
                Novo estudante?{" "}
                <span
                  onClick={() => {
                    setIsRegistering(true)
                    setError("")
                  }}
                  className="link-text"
                >
                  Criar conta
                </span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form animate">
              <div className="form-header">
                <FaUserPlus className="form-icon" />
                <h2>Registro Acadêmico</h2>
                <p>Crie sua conta na biblioteca</p>
              </div>
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="E-mail acadêmico"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Criar senha"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <FaGraduationCap className="input-icon" />
                <select value={registerRole} onChange={(e) => setRegisterRole(e.target.value)} required>
                  <option value="USER">Estudante</option>
                  <option value="ADMIN">Bibliotecário</option>
                </select>
              </div>
              {error && <div className="alert-message error">{error}</div>}
              <button type="submit" className="btn btn-success">
                Criar Conta
              </button>
              <p className="switch-form-text">
                Já possui conta?{" "}
                <span
                  onClick={() => {
                    setIsRegistering(false)
                    setError("")
                  }}
                  className="link-text"
                >
                  Fazer login
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
