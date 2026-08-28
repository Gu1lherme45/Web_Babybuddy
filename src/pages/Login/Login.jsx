import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './Login.module.css';
import LoadingWave from '../../components/LoadingWave';
import WelcomeLoader from '../../components/WelcomeLoader';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { entrar } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [carregandoAdmin, setCarregandoAdmin] = useState(false);
  const [carregandoUsuario, setCarregandoUsuario] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);

    try {
      const usuario = await entrar(formData.email, formData.senha);
      const isAdmin = usuario?.nivelAcesso === 'ADMIN';

      if (isAdmin) {
        setCarregandoAdmin(true);
        setTimeout(() => {
          navigate('/administrador');
        }, 1400);
      } else {
        setCarregandoUsuario(true);
        setTimeout(() => {
          navigate('/perfil');
        }, 5000);
      }
    } catch (err) {
      setErro(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível fazer login. Tente novamente.'
      );
      setEnviando(false);
    }
  };

  if (carregandoAdmin) {
    return (
      <div className={styles.container}>
        <LoadingWave />
      </div>
    );
  }

  if (carregandoUsuario) {
    return (
      <div className={styles.container}>
        <WelcomeLoader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Digite seus dados para acessar sua conta</p>

        {erro && <div className={styles.error}>{erro}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* EMAIL */}
          <div className={styles.inputGroup}>
            <label>E-mail</label>
            <div className={styles.inputWrapper}>
              <FiMail className={styles.icon} />
              <input
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* SENHA */}
          <div className={styles.inputGroup}>
            <label>Senha</label>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.icon} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="senha"
                placeholder="Digite sua senha"
                value={formData.senha}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.loginButton} disabled={enviando}>
            {enviando ? 'Entrando...' : 'Login'}
          </button>

          <div className={styles.divider}>
            <span>ou</span>
          </div>

          <p className={styles.registerText}>
            Ainda não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
