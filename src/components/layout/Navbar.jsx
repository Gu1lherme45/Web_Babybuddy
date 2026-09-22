import styles from './Navbar.module.css';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logoofc3.svg';
import useAuth from '../../auth/useAuth';

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const hidden = [
    '/questionario', '/cadastro', '/login', '/perfil',
    '/termos-de-uso', '/politica-de-privacidade',
  ].includes(location.pathname) || location.pathname.startsWith('/administrador');

  if (hidden) return null;

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
            <Link to={user.nivelAcesso?.toUpperCase() === 'ADMIN' ? '/administrador' : '/perfil'} className={styles.login}>
              Minha conta
            </Link>
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
