import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiClipboard, FiBell, FiHeart, FiCheckCircle } from 'react-icons/fi';
import styles from './Cadastro.module.css';
import useAuth from '../../auth/useAuth';

const DDDS_VALIDOS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24,
  27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

function formatarTelefone(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  if (digitos.length < 2) return digitos;
  const ddd = digitos.slice(0, 2);
  if (!DDDS_VALIDOS.has(Number(ddd))) return digitos;
  const resto = digitos.slice(2);
  if (resto.length === 0) return `(${ddd}) `;
  if (resto.length <= 4) return `(${ddd}) ${resto}`;
  const corte = resto.length > 8 ? 5 : 4;
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
}

export default function Cadastro() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', senha: '', confirmarSenha: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [location.hash]);

  useEffect(() => {
    if (!accountCreated) return;
    setShowToast(true);
    const hideToast = setTimeout(() => setShowToast(false), 2000);
    const timer = setTimeout(() => navigate('/questionario'), 3000);
    return () => {
      clearTimeout(hideToast);
      clearTimeout(timer);
    };
  }, [accountCreated, navigate]);

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!/[A-Z]/.test(form.senha) || !/[0-9]/.test(form.senha)) {
      setError('A senha deve conter pelo menos uma letra maiúscula e um número.');
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await register({ nome: form.nome.trim(), username: form.email, password: form.senha });
      setAccountCreated(true);
      try {
        await login(form.email, form.senha);
      } catch {
        // segue para o questionário; o ProtectedRoute pede login se a sessão não iniciou
      }
    } catch (requestError) {
      const status = requestError.status || requestError.response?.status;
      const backendMessage = requestError.response?.data?.error || requestError.response?.data?.message;
      setError(status === 409
        ? 'Este e-mail já está cadastrado.'
        : status === 401
          ? 'Não foi possível validar a sessão segura. Atualize a página e tente novamente.'
          : backendMessage || requestError.message || 'Não foi possível concluir o cadastro. Confira os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      {showToast && (
        <div className={styles.toast} role="status">
          <FiCheckCircle className={styles.toastIcon} aria-hidden="true" />
          Conta criada com sucesso!
        </div>
      )}
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <h1>Acompanhe cada <span>momento da sua gestação</span></h1>
          <p className={styles.description}>Crie sua conta e tenha um acompanhamento completo, organizado e seguro.</p>
          <div className={styles.features}>
            {[
              [<FiClipboard key="monitoramento" />, 'Monitoramento contínuo', 'Acompanhe o crescimento do bebê, exames e marcos da sua gestação.'],
              [<FiBell key="lembretes" />, 'Lembretes personalizados', 'Receba alertas de consultas e cuidados importantes.'],
              [<FiHeart key="cuidado" />, 'Tudo em um só lugar', 'Cuidado gestacional completo em uma única plataforma.'],
            ].map(([icon, title, description]) => (
              <div className={styles.featureItem} key={title}>
                <div className={styles.iconBox}>{icon}</div>
                <div><h3>{title}</h3><p>{description}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        {!accountCreated && (
          <div className={styles.card} id="formulario">
            <h2 className={styles.title}>Criar conta</h2>
            <p className={styles.subtitle}>Preencha os campos abaixo para se cadastrar</p>
            {error && <div className={styles.error} role="alert">{error}</div>}
              <form onSubmit={handleSubmit} className={styles.form}>
                <Field label="Nome completo" htmlFor="nome" icon={<FiUser />}>
                  <input id="nome" name="nome" placeholder="Seu nome completo" value={form.nome} onChange={(event) => update('nome', event.target.value)} autoComplete="name" required />
                </Field>
                <Field label="E-mail" htmlFor="email" icon={<FiMail />}>
                  <input id="email" name="email" placeholder="seu@email.com" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} autoComplete="username" required />
                </Field>
                <Field label="Telefone" htmlFor="telefone" icon={<FiPhone />}>
                  <input id="telefone" name="telefone" placeholder="(00) 00000-0000" type="tel" value={form.telefone} onChange={(event) => update('telefone', formatarTelefone(event.target.value))} autoComplete="tel" />
                </Field>
                <Field label="Senha" htmlFor="senha" icon={<FiLock />}>
                  <input id="senha" name="senha" placeholder="Mín. 8 caracteres, 1 maiúscula e 1 número" type={showPassword ? 'text' : 'password'} value={form.senha}
                    onChange={(event) => update('senha', event.target.value)} autoComplete="new-password" minLength={8}
                    pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
                    title="A senha deve ter pelo menos 8 caracteres, incluindo 1 letra maiúscula e 1 número."
                    required />
                  <FiEyeButton visible={showPassword} onClick={() => setShowPassword((value) => !value)} />
                </Field>
                <Field label="Confirmar senha" htmlFor="confirmarSenha" icon={<FiLock />}>
                  <input id="confirmarSenha" name="confirmarSenha" placeholder="Digite sua senha novamente" type={showConfirmation ? 'text' : 'password'} value={form.confirmarSenha}
                    onChange={(event) => update('confirmarSenha', event.target.value)} autoComplete="new-password" minLength={8} required />
                  <FiEyeButton visible={showConfirmation} onClick={() => setShowConfirmation((value) => !value)} />
                </Field>
                <div className={styles.terms}>
                  <input type="checkbox" required aria-label="Aceitar termos" />
                  <p>Eu concordo com os <Link to="/termos-de-uso" className={styles.link}>Termos de Uso</Link> e a{' '}
                    <Link to="/politica-de-privacidade" className={styles.link}>Política de Privacidade</Link>.</p>
                </div>
                <button type="submit" disabled={loading} className={styles.btn}>{loading ? 'Cadastrando...' : 'Criar minha conta'}</button>
              </form>
              <div className={styles.divider}><span /><p>ou</p><span /></div>
              <p className={styles.loginText}>Já tem uma conta? <span onClick={() => navigate('/login')}>Entrar</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, htmlFor, icon, children }) {
  return <div className={styles.inputGroup}><label htmlFor={htmlFor}>{label}</label><div className={styles.inputBox}>{icon}{children}</div></div>;
}

function FiEyeButton({ visible, onClick }) {
  const Icon = visible ? FiEyeOff : FiEye;
  return <Icon className={styles.eye} onClick={onClick} role="button" tabIndex={0}
    aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'} onKeyDown={(event) => event.key === 'Enter' && onClick()} />;
}
