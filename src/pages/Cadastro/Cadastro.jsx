import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';


import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiClipboard,
  FiBell,
  FiHeart
} from 'react-icons/fi';

import styles from './Cadastro.module.css';
import { CgPassword } from 'react-icons/cg';
import { criarUsuario, ApiError } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Cadastro() {

  const { entrar } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  }, [location]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // 👁 MOSTRAR / ESCONDER SENHAS
  const [showSenha, setShowSenha] =
    useState(false);

  const [
    showConfirmarSenha,
    setShowConfirmarSenha
  ] = useState(false);



  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const nome =
      document.getElementById('nome').value;

    const email =
      document.getElementById('email').value;

    const telefone =
      document.getElementById('telefone').value;

    const senha =
      document.getElementById('senha').value;

    const confirmarSenha =
      document.getElementById(
        'confirmarSenha'
      ).value;

    // ✅ VALIDAÇÃO DAS SENHAS
    if (senha !== confirmarSenha) {

      setError(
        "As senhas não coincidem."
      );

      setLoading(false);
      return;
    }

    const novoUsuario = {
      nome,
      username: email,
      password: senha,
      nivelAcesso: 'Gestante',
    };

    try {

      await criarUsuario(novoUsuario);

      // login automático com as credenciais recém-criadas, para que
      // /questionario (rota protegida) já reconheça a sessão
      await entrar(novoUsuario.username, novoUsuario.password);

      setSuccess(
        'Cadastro realizado com sucesso!'
      );

      // REDIRECIONA
      setTimeout(() => {
        navigate('/questionario');
      }, 1000);

    } catch (err) {

      setError(
        err instanceof ApiError
          ? err.message
          : 'Erro ao cadastrar usuário.'
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className={styles.container}>

      <div className={styles.left}>

        <div className={styles.leftContent}>

          <h1>
            Acompanhe cada
            <span>
              {' '}momento da sua gestação
            </span>
          </h1>

          <p className={styles.description}>
            Crie sua conta e tenha um
            acompanhamento completo,
            organizado e seguro.
          </p>

          <div className={styles.features}>

            <div className={styles.featureItem}>

              <div className={styles.iconBox}>
                <FiClipboard />
              </div>

              <div>
                <h3>
                  Monitoramento contínuo
                </h3>

                <p>
                  Acompanhe o crescimento
                  do bebê, exames e marcos
                  da sua gestação.
                </p>
              </div>

            </div>

            <div className={styles.featureItem}>

              <div className={styles.iconBox}>
                <FiBell />
              </div>

              <div>

                <h3>
                  Lembretes personalizados
                </h3>

                <p>
                  Receba alertas de
                  consultas e cuidados
                  importantes.
                </p>

              </div>

            </div>

            <div className={styles.featureItem}>

              <div className={styles.iconBox}>
                <FiHeart />
              </div>

              <div>

                <h3>
                  Tudo em um só lugar
                </h3>

                <p>
                  Cuidado gestacional
                  completo em uma única
                  plataforma.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className={styles.right}>

        <div
          className={styles.card}
          id="formulario"
        >

          <h2 className={styles.title}>
            Criar conta
          </h2>

          <p className={styles.subtitle}>
            Preencha os campos abaixo
            para se cadastrar
          </p>

          {
            success && (
              <div className={styles.success}>
                {success}
              </div>
            )
          }

          {
            error && (
              <div className={styles.error}>
                {error}
              </div>
            )
          }

          <form
            onSubmit={handleSubmit}
            className={styles.form}
          >

            {/* NOME */}
            <div className={styles.inputGroup}>

              <label>
                Nome completo
              </label>

              <div className={styles.inputBox}>

                <FiUser />

                <input
                  type="text"
                  id="nome"
                  placeholder="Seu nome completo"
                  required
                />

              </div>

            </div>

            {/* EMAIL */}
            <div className={styles.inputGroup}>

              <label>
                E-mail
              </label>

              <div className={styles.inputBox}>

                <FiMail />

                <input
                  type="email"
                  id="email"
                  placeholder="seu@email.com"
                  required
                />

              </div>

            </div>

            {/* TELEFONE */}
            <div className={styles.inputGroup}>
              <label>
                Telefone
              </label>

              <div className={styles.inputBox}>

                <FiPhone />

                <input
                  type="tel"
                  id="telefone"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            {/* SENHA */}
            <div className={styles.inputGroup}>

              <label>
                Senha
              </label>

              <div className={styles.inputBox}>
                <FiLock />
                <input
                  type={
                    showSenha
                      ? "text"
                      : "password"
                  }
                  id="senha"
                  placeholder="Mínimo de 8 caracteres"
                  required
                />

                {
                  showSenha ? (

                    <FiEyeOff
                      className={styles.eye}
                      onClick={() =>
                        setShowSenha(false)
                      }
                    />

                  ) : (

                    <FiEye
                      className={styles.eye}
                      onClick={() =>
                        setShowSenha(true)
                      }
                    />

                  )
                }
              </div>
            </div>

            {/* CONFIRMAR SENHA */}
            <div className={styles.inputGroup}>
              <label>
                Confirmar senha
              </label>

              <div className={styles.inputBox}>
                <FiLock />

                <input
                  type={
                    showConfirmarSenha
                      ? "text"
                      : "password"
                  }
                  id="confirmarSenha"
                  placeholder="Digite sua senha novamente"
                  required
                />
                {

                  showConfirmarSenha ? (
                    <FiEyeOff
                      className={styles.eye}
                      onClick={() =>
                        setShowConfirmarSenha(false)
                      }
                    />

                  ) : (

                    <FiEye
                      className={styles.eye}
                      onClick={() =>
                        setShowConfirmarSenha(true)
                      }
                    />

                  )
                }
              </div>
            </div>

            {/* TERMOS */}
            <div className={styles.terms}>
              <input
                type="checkbox"
                required
              />

              <p>
                Eu concordo com os
                <Link
                  to="/termos-de-uso"
                  className={styles.link}
                >
                  {' '}Termos de Uso
                </Link>

                {' '}e{' '}

                <Link
                  to="/politica-de-privacidade"
                  className={styles.link}
                >
                  Política de Privacidade
                </Link>
              </p>
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              disabled={loading}
              className={styles.btn}
            >
              {
                loading
                  ? "Cadastrando..."
                  : "Criar minha conta"
              }
            </button>
          </form>

          <div className={styles.divider}>
            <span></span>
            <p>ou</p>
            <span></span>
          </div>

          

          <p className={styles.loginText}>
            Já tem uma conta?
            <span
              onClick={() =>
                navigate('/login')
              }
            >
              Entrar
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}