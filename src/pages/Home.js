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
} from "react-icons/fa"

function HomeOption2() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerRole, setRegisterRole] = useState("USER")
  const [error, setError] = useState("")
  const [registerDataNascimento, setRegisterDataNascimento] = useState("")

  const navigate = useNavigate()

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
      if (err.response?.data?.message) {
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
        dataNascimento: registerDataNascimento,
      })
      const { token, name: userName } = response.data
      localStorage.setItem("token", token)
      localStorage.setItem("userName", userName)
      navigate("/dashboard")
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError("Erro ao registrar. Verifique os dados e tente novamente.")
      }
    }
  }

  return (
    <div className="home-option2-container">
      <div className="floating-pages">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="page" style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
      </div>

      <div className="bookshelf-background">
        <div className="shelf">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="book" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>

      <div className="decorative-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="home-option2-content">
        <div className="left-section">
          <div className="brand-section">
            <div className="logo-glow">
              <FaBookOpen className="main-logo" />
            </div>
            <h1>BiblioTech</h1>
            <p className="tagline">Conhecimento ao seu alcance</p>

            <div className="features">
              <div className="feature-item">
                <div className="feature-icon">📚</div>
                <span>Acervo Digital</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <span>Busca Inteligente</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⭐</div>
                <span>Favoritos</span>
              </div>
            </div>

            <div className="stats">
              <div className="stat-item">
                <FaBook />
                <div>
                  <strong>10.000+</strong>
                  <span>Livros</span>
                </div>
              </div>
              <div className="stat-item">
                <FaGraduationCap />
                <div>
                  <strong>5.000+</strong>
                  <span>Estudantes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="form-glass-wrapper">
            <div className="form-card">
              {!isRegistering ? (
                <form onSubmit={handleLogin} className="auth-form-option2">
                  <div className="form-header">
                    <div className="form-icon">
                      <FaSignInAlt />
                    </div>
                    <h2>Bem-vindo de volta</h2>
                    <p className="subtitle">Entre para continuar sua jornada</p>
                  </div>

                  <div className="form-group">
                    <label>E-mail</label>
                    <div className="input-container">
                      <FaEnvelope />
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Senha</label>
                    <div className="input-container">
                      <FaLock />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {error && <div className="alert-error">{error}</div>}

                  <button type="submit" className="btn-submit">
                    <FaSignInAlt /> Entrar
                  </button>

                  <p className="switch-text">
                    Não tem uma conta?{" "}
                    <span onClick={() => setIsRegistering(true)} className="link">
                      Cadastre-se
                    </span>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="auth-form-option2">
                  <div className="form-header">
                    <div className="form-icon">
                      <FaUserPlus />
                    </div>
                    <h2>Criar conta</h2>
                    <p className="subtitle">Junte-se à nossa comunidade</p>
                  </div>

                  <div className="form-group">
                    <label>Nome completo</label>
                    <div className="input-container">
                      <FaUser />
                      <input
                        type="text"
                        placeholder="Seu nome"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>E-mail</label>
                    <div className="input-container">
                      <FaEnvelope />
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Senha</label>
                    <div className="input-container">
                      <FaLock />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Data de nascimento</label>
                    <div className="input-container">
                      <FaUser />
                      <input
                        type="date"
                        value={registerDataNascimento}
                        onChange={(e) => setRegisterDataNascimento(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Tipo de conta</label>
                    <div className="input-container">
                      <FaGraduationCap />
                      <select value={registerRole} onChange={(e) => setRegisterRole(e.target.value)} required>
                        <option value="USER">Estudante</option>
                        <option value="ADMIN">Bibliotecário</option>
                      </select>
                    </div>
                  </div>

                  {error && <div className="alert-error">{error}</div>}

                  <button type="submit" className="btn-submit">
                    <FaUserPlus /> Criar conta
                  </button>

                  <p className="switch-text">
                    Já tem uma conta?{" "}
                    <span onClick={() => setIsRegistering(false)} className="link">
                      Entrar
                    </span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeOption2
