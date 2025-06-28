import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Importe o novo componente de Layout
import Layout from './components/Layout'; 


// Importe suas páginas
import Home from './pages/Home';
import CadastroUsuario from './pages/CadastroUsuario';
import LoginUsuario from './pages/LoginUsuario';
import Dashboard from './pages/Dashboard';
import ListaLivrosPage from './pages/ListaLivrosPage';
import CadastroLivros from './pages/CadastroLivros';
// Supondo que você tenha uma página de Perfil também
  import Perfil from './pages/Perfil'; 


function App() {
  return (
    <Router>
      <Routes>
        {/* --- ROTAS PÚBLICAS (Sem Sidebar) --- */}
        {/* Estas rotas não são envolvidas pelo Layout */}
        <Route path="/" element={<Home />} />
        <Route path="/login-usuario" element={<LoginUsuario />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />

        {/* --- ROTAS PRIVADAS (Com Sidebar) --- */}
        {/* Todas as rotas aqui dentro terão a sidebar e o dark mode automaticamente */}
        <Route 
          path="/dashboard" 
          element={<Layout><Dashboard /></Layout>} 
        />
        <Route 
          path="/lista-livros" 
          element={<Layout><ListaLivrosPage /></Layout>} 
        />
        <Route 
          path="/cadastro-livros" 
          element={<Layout><CadastroLivros /></Layout>} 
        />
        <Route path="/editar/:livroId" element={<CadastroLivros />} />
         
        <Route path="/perfil" element={<Layout><Perfil /></Layout>} /> 
        
      </Routes>
     
    </Router>
  );
}

export default App;