import React, { useState } from 'react';
import styles from './Login.module.css';

import { Link, useNavigate } from 'react-router-dom';

import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const administradores = [
  {
    nome: "Kemilly",
    email: "administrador@babybuddy.com.br",
    senha: "BabyBuddy2026"
  },
  {
    nome: "Laura", 
    email: "administrador@babybuddy.com.br",
    senha: "BabyBuddy2026"
  },
  {
    nome: "Guilherme",
    email: "administrador@babybuddy.com.br",
    senha: "BabyBuddy2026"
  },
  {
    nome: "Nicolly",
    email: "administrador@babybuddy.com.br",
    senha: "BabyBuddy2026"
  },
  {
    nome: "Vinicius",
    email: "administrador@babybuddy.com.br",
    senha: "BabyBuddy2026"
  },
  {
    nome: "Giulia",
    email: "administrador@babybuddy.com.br",
    senha: "BabyBuddy2026"
  }
];

  

  const handleSubmit = (e) => {
    e.preventDefault();

    // EMAIL DIGITADO
    const email = formData.email.toLowerCase();

  const admin = administradores.find(
  (item) =>
    item.email === email &&
    item.senha === formData.senha
);

const isAdmin = !!admin;

    // DADOS DO USUÁRIO
 const usuario = {
  nome: formData.nome,
  email: formData.email,
  senha: formData.senha,
  tipo: isAdmin ? "admin" : "usuario",
  admin: isAdmin,
};

    // SALVA NO LOCALSTORAGE
    localStorage.setItem(
      'usuario',
      JSON.stringify(usuario)
    );

    console.log(usuario);

    // REDIRECIONAMENTO
    if (isAdmin) {
      navigate('/administrador');
    } else {
      navigate('/perfil');
    }
  };





  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <h1 className={styles.title}>Login</h1>

        <p className={styles.subtitle}>
          Digite seus dados para acessar sua conta
        </p>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >

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
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.loginButton}
          >
            Login
          </button>

          <div className={styles.divider}>
            <span>ou</span>
          </div>

          <p className={styles.registerText}>
            Ainda não tem uma conta?{' '}
            <Link to="/cadastro">
              Cadastre-se
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;
