import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './Login.module.css';
import LoadingWave from '../../components/LoadingWave';
import WelcomeLoader from '../../components/WelcomeLoader';
import useAuth from '../../auth/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loadingRole, setLoadingRole] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      const isAdmin = user.nivelAcesso?.toUpperCase() === 'ADMIN';
      setLoadingRole(isAdmin ? 'admin' : 'user');
      const requested = location.state?.from?.pathname;
      const destination = requested && (!requested.startsWith('/administrador') || isAdmin)
        ? requested
        : isAdmin ? '/administrador' : '/perfil';
      window.setTimeout(() => navigate(destination, { replace: true }), isAdmin ? 700 : 1200);
    } catch (requestError) {
      setError(requestError.response?.status === 401
        ? 'E-mail ou senha inválidos.'
        : 'Não foi possível entrar. Tente novamente.');
    }
  }

  if (loadingRole === 'admin') return <div className={styles.container}><LoadingWave /></div>;
  if (loadingRole === 'user') return <div className={styles.container}><WelcomeLoader /></div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Digite seus dados para acessar sua conta</p>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="login-email">E-mail</label>
            <div className={styles.inputWrapper}>
              <FiMail className={styles.icon} />
              <input id="login-email" type="email" autoComplete="username" value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="login-password">Senha</label>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.icon} />
              <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
              <button type="button" className={styles.eyeButton} onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <button type="submit" className={styles.loginButton}>Login</button>
          <div className={styles.divider}><span>ou</span></div>
          <p className={styles.registerText}>Ainda não tem uma conta? <Link to="/cadastro">Cadastre-se</Link></p>
        </form>
      </div>
    </div>
  );
}
