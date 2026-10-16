import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import logo from '../../assets/logofooter.svg';
import useIsMobile from '../../hooks/useIsMobile';

export default function Footer({ waveColor = "#ffffff" }) {
  const isMobile = useIsMobile();

  return (
    <footer className={styles.footer}>

      {/* 🌊 ONDA NO TOPO (no mobile, uma onda só, no mesmo estilo da onda
          que fica acima do footer na home, pra combinar com ela) */}
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={styles.footerWave}
      >
        <path
          d={isMobile
            ? "M0,0C480,90,960,90,1440,0L1440,0L0,0Z"
            : "M0,40C120,80,240,80,360,60C480,40,600,0,720,0C840,0,960,40,1080,60C1200,80,1320,80,1440,40L1440,0L0,0Z"}
          fill={waveColor}
        />
      </svg>

      <div className={styles.container}>

        {/* Logo */}
        <div className={styles.left}>
          <img src={logo} alt="BabyBuddy Logo" className={styles.logo} />
        </div>

        {/* Links */}
        <div className={styles.links}>

          <div>
            <h4>PRODUTO</h4>
            <Link to="/seguranca">Segurança</Link>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=babybuddy159@gmail.com&su=Suporte%20-%20BabyBuddy&body=Olá,%20preciso%20de%20ajuda%20com%20o%20seguinte:%0A%0A•%20Problema:%0A%0A•%20E-mail%20para%20contato:"
              rel="noopener noreferrer"
            >
              Suporte
            </a>
          </div>

          <div>
            <h4>CONTEÚDO</h4>
            <a href="/#artigoshome">Artigos</a>
            <Link to="/sobre">Sobre</Link>
            <Link to="/cadastro">Cadastro</Link>
          </div>

          <div>
            <h4>PRIVACIDADE</h4>
            <Link to="/termos-de-uso">Termos de Uso</Link>
            <Link to="/politica-de-privacidade">Política de Privacidade</Link>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className={styles.bottom}>
        © 2026 BabyBuddy — Todos os direitos reservados.
      </div>

    </footer>
  );
}