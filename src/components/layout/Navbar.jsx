import styles from './Navbar.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import logo from '../../assets/logoofc3.svg';
import useAuth from '../../auth/useAuth';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = user?.nivelAcesso?.toUpperCase() === 'ADMIN';
  const hidden = location.pathname.startsWith('/administrador') || [
    '/questionario', '/cadastro', '/login', '/perfil',
    '/termos-de-uso', '/politica-de-privacidade',
  ].includes(location.pathname);

  if (hidden) return null;

  async function signOut() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to={user ? '/perfil' : '/'} className={styles.logo}>
          <img src={logo} alt="BabyBuddy" className={styles.logoImg} />
        </Link>

        <div className={styles.links}>
          <Link to="/#inicio">Início</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/#artigoshome">Artigos</Link>
        </div>

        <div className={styles.actions}>
          {user ? (
            <>
              {!isAdmin && <Link to="/perfil" className={styles.login}>Minha conta</Link>}
              <button type="button" onClick={signOut} className={`${styles.cadastro} ${styles.actionButton}`}>
                <LogOut size={18} /> Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.login}>Login</Link>
              <Link to="/cadastro" className={styles.cadastro}>Cadastre-se</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
