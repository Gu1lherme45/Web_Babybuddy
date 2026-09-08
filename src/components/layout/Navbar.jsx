import styles from './Navbar.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logoofc3.svg';
import { useAuth } from '../../context/AuthContext';
import { scrollToHashTarget } from '../../hooks/useHashScroll';

const PROTECTED_PATHS = ['/perfil', '/questionario', '/administrador'];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, sair } = useAuth();

  const shouldHideNavbar = ['/login', '/cadastro'].includes(location.pathname);
  const isProtectedPage = PROTECTED_PATHS.includes(location.pathname);
  const isAdmin = usuario?.nivelAcesso === 'ADMIN';
  const authenticatedHome = isAdmin ? '/administrador' : '/perfil';
  const homeTarget = usuario ? authenticatedHome : '/#inicio';
  const articlesTarget = usuario
    ? `${authenticatedHome}#artigos`
    : '/#artigoshome';

  // Login e cadastro usam layout próprio.
  if (shouldHideNavbar) return null;

  async function handleLogout() {
    await sair();
    navigate('/login', { replace: true });
  }

  function handleArticlesClick() {
    if (location.pathname === authenticatedHome) {
      window.requestAnimationFrame(() => scrollToHashTarget('#artigos'));
    }
  }

  return (
    <nav
      className={`${styles.navbar} ${
        isProtectedPage ? styles.navbarInFlow : ''
      }`}
      aria-label="Navegação principal"
    >
      <div className={styles.container}>
        <Link to={usuario ? authenticatedHome : '/'} className={styles.logo}>
          <img src={logo} alt="BabyBuddy" className={styles.logoImg} />
        </Link>

        <div className={styles.links}>
          <Link to={homeTarget}>Início</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to={articlesTarget} onClick={handleArticlesClick}>
            Artigos
          </Link>
        </div>

        <div className={styles.actions}>
          {usuario ? (
            <>
              <Link
                to={
                  isAdmin ? '/administrador' : '/perfil'
                }
                className={styles.login}
              >
                {isAdmin ? 'Painel' : 'Meu perfil'}
              </Link>

              <button
                type="button"
                className={`${styles.cadastro} ${styles.actionButton}`}
                onClick={handleLogout}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.login}>
                Login
              </Link>

              <Link to="/cadastro" className={styles.cadastro}>
                Cadastre-se
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
