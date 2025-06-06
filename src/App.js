import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CadastroLivros from './pages/CadastroLivros';
import CadastroUsuario from './pages/CadastroUsuario';
import LoginUsuario from './pages/LoginUsuario';  
import Dashboard from './pages/Dashboard';
import ListaLivrosPage from './pages/ListaLivrosPage'; // Importando a página de lista de livros


// importar outras páginas...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro-livros" element={<CadastroLivros />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route path="/login-usuario" element={<LoginUsuario />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lista-livros" element={<ListaLivrosPage />} /> {/* Rota para a lista de livros */}
        
      
     
        {/* outras rotas depois */}
      </Routes>
    </Router>
  );
}

export default App;
