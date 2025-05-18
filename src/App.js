import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Acervo from './pages/Acervo';
import CadastroLivros from './pages/CadastroLivros';
import CadastroUsuario from './pages/CadastroUsuario';
import LoginUsuario from './pages/LoginUsuario';  
// importar outras páginas...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acervo" element={<Acervo />} />
        <Route path="/cadastro-livros" element={<CadastroLivros />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route path="/login-usuario" element={<LoginUsuario />} />
        {/* outras rotas depois */}
      </Routes>
    </Router>
  );
}

export default App;
