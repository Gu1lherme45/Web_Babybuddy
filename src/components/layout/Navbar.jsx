
import styles from './Navbar.module.css';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logoofc3.svg';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { usuario } = useAuth();

// detecta páginas
const isQuestionario = location.pathname === "/questionario";
const isCadastro = location.pathname === "/cadastro";
const isLogin = location.pathname === "/login";
const isPerfil = location.pathname === "/perfil";
const isAdministrador = location.pathname === "/administrador";
const isTermosDeUso = location.pathname === "/termos-de-uso";
const isPoliticaDePrivacidade = location.pathname === "/politica-de-privacidade";

 
// esconde navbar nessas páginas
if (
  isQuestionario ||
  isCadastro ||
  isLogin ||
  isPerfil ||
  isAdministrador ||
  isTermosDeUso ||
  isPoliticaDePrivacidade 
)

return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>

        {usuario ? (
          <Link to="/perfil" className={styles.logo}>
            <img src={logo} alt="BabyBuddy" className={styles.logoImg} />
          </Link>
        ) : (
          <span className={styles.logo}>
            <img src={logo} alt="BabyBuddy" className={styles.logoImg} />
          </span>
        )}



        <div className={styles.links}>
          <Link to="/#inicio">Início</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/#artigoshome">Artigos</Link>
        </div>

        <div className={styles.actions}>
          <Link to="/login" className={styles.login}>
            Login
          </Link>

          <Link to="/cadastro" className={styles.cadastro}> 
            Cadastre-se
          </Link>
        </div>

      </div>
    </nav>
  );
}
