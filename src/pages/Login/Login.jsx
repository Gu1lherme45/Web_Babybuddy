import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './Login.module.css';
import LoadingWave from '../../components/LoadingWave';
import WelcomeLoader from '../../components/WelcomeLoader';

// Administrador
const ADMIN = {
  email: 'administrador@babybuddy.com.br',
  senha: 'BabyBuddy2026',
};

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [carregandoAdmin, setCarregandoAdmin] = useState(false);
  const [carregandoUsuario, setCarregandoUsuario] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });

  // Deixa a primeira letra de cada nome maiúscula, mesmo digitado em minúsculo
  const capitalizarNome = (texto) =>
    texto
      .toLowerCase()
      .split(' ')
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === 'nome' ? capitalizarNome(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Email
    const email = formData.email.toLowerCase();

    const isAdmin =
      email === ADMIN.email && formData.senha === ADMIN.senha;

    // Dados do usuário
    const usuario = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      tipo: isAdmin ? 'admin' : 'usuario',
      admin: isAdmin,
    };

    // Salva no localStorage
    localStorage.setItem('usuario', JSON.stringify(usuario));

    console.log(usuario);

    // Redirecionamento
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

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* NOME */}
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <div className={styles.inputWrapper}>
              <FiUser className={styles.icon} />
              <input
                type="text"
                name="nome"
                placeholder="Digite seu nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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

          <button type="submit" className={styles.loginButton}>
            Login
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