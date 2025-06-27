import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiUsuario from '../services/usuarioApi';

function Perfil() {
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(false);
  const [emailToken, setEmailToken] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [form, setForm] = useState({
    nome: '',
    email: '',
    novaSenha: ''
  });

  // Pega o e-mail do token ao carregar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setEmailToken(decoded.sub);
      } catch (err) {
        console.error('Erro ao decodificar token', err);
      }
    }
  }, []);

  // Confirma senha antes de mostrar os dados
  async function verificarSenha(senhaDigitada, email) {
    try {
      const response = await apiUsuario.get(
        `user/comparar-senhas/${encodeURIComponent(senhaDigitada)}/email/${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar senha:', error);
      throw error;
    }
  }

  const handleConfirmarSenha = async () => {
    try {
      const valido = await verificarSenha(senhaConfirmacao, emailToken);
      if (valido) {
        setCarregandoPerfil(true);
        await carregarDadosUsuario();
        setAutenticado(true);
        setCarregandoPerfil(false);
        setErro('');
      } else {
        setErro('Senha incorreta.');
      }
    } catch {
      setErro('Erro ao verificar senha.');
    }
  };

  // Busca os dados do usuário
  const carregarDadosUsuario = async () => {
    try {
      const response = await apiUsuario.get(`user/recuperar/${encodeURIComponent(emailToken)}`);
      const { name, email } = response.data;
      console.log('Dados carregados:', { name, email});
      setForm({ nome: name, email, novaSenha: '' });
    } catch (error) {
      console.error('Erro ao carregar dados do usuário', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleAtualizar = async () => {
  try {
    const payload = {
      newName: form.nome,
      newEmail: form.email,
      newPassword: form.novaSenha || undefined
    };

    const response = await apiUsuario.put(`user/${emailToken}`, payload);

    const novoToken = response.data;
    localStorage.setItem('token', novoToken);

    const decoded = jwtDecode(novoToken);
    setEmailToken(decoded.sub);

    setMensagem('Dados atualizados com sucesso!');
    setForm((prev) => ({ ...prev, novaSenha: '' }));
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    setMensagem('Erro ao atualizar perfil.');
  }
};


  // Tela de confirmação de senha
  if (!autenticado) {
    return (
      <div>
        <h2>🔐 Confirme sua senha para acessar o perfil</h2>
        <input
          type="password"
          value={senhaConfirmacao}
          onChange={(e) => setSenhaConfirmacao(e.target.value)}
          placeholder="Digite sua senha"
        />
        <button onClick={handleConfirmarSenha}>Confirmar</button>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </div>
    );
  }

  // Tela de carregamento do perfil
  if (carregandoPerfil) {
    return <p>🔄 Carregando dados do perfil...</p>;
  }

  // Tela de edição do perfil
  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h1>👤 Meu Perfil</h1>

      <div>
        <label>Nome:</label>
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Seu nome"
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Seu email"
        />
      </div>

      <div>
        <label>Nova Senha:</label>
        <input
          type="password"
          name="novaSenha"
          value={form.novaSenha}
          onChange={handleChange}
          placeholder="Nova senha (opcional)"
        />
      </div>

      <button onClick={handleAtualizar}>Atualizar</button>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default Perfil;
