import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiClipboard, FiBell, FiHeart } from 'react-icons/fi';
import styles from './Cadastro.module.css';
import useAuth from '../../auth/useAuth';

export default function Cadastro() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', senha: '', confirmarSenha: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [location.hash]);

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (form.senha !== form.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await register({ nome: form.nome.trim(), username: form.email, password: form.senha });
      await login(form.email, form.senha);
      setSuccess('Cadastro realizado com sucesso!');
      window.setTimeout(() => navigate('/questionario'), 700);
    } catch (requestError) {
      const status = requestError.response?.status;
      const backendMessage = requestError.response?.data?.error || requestError.response?.data?.message;
      setError(status === 409
        ? 'Este e-mail já está cadastrado.'
        : status === 401
          ? 'Não foi possível validar a sessão segura. Atualize a página e tente novamente.'
          : backendMessage || 'Não foi possível concluir o cadastro. Confira os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
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
        <div className={styles.card} id="formulario">
          <h2 className={styles.title}>Criar conta</h2>
          <p className={styles.subtitle}>Preencha os campos abaixo para se cadastrar</p>
          {success && <div className={styles.success} role="status">{success}</div>}
          {error && <div className={styles.error} role="alert">{error}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <Field label="Nome completo" icon={<FiUser />}>
              <input value={form.nome} onChange={(event) => update('nome', event.target.value)} autoComplete="name" required />
            </Field>
            <Field label="E-mail" icon={<FiMail />}>
              <input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} autoComplete="username" required />
            </Field>
            <Field label="Telefone (opcional, não armazenado)" icon={<FiPhone />}>
              <input type="tel" value={form.telefone} onChange={(event) => update('telefone', event.target.value)} autoComplete="tel" />
            </Field>
            <Field label="Senha" icon={<FiLock />}>
              <input type={showPassword ? 'text' : 'password'} value={form.senha}
                onChange={(event) => update('senha', event.target.value)} autoComplete="new-password" minLength={8} required />
              <FiEyeButton visible={showPassword} onClick={() => setShowPassword((value) => !value)} />
            </Field>
            <Field label="Confirmar senha" icon={<FiLock />}>
              <input type={showConfirmation ? 'text' : 'password'} value={form.confirmarSenha}
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
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return <div className={styles.inputGroup}><label>{label}</label><div className={styles.inputBox}>{icon}{children}</div></div>;
}

function FiEyeButton({ visible, onClick }) {
  const Icon = visible ? FiEyeOff : FiEye;
  return <Icon className={styles.eye} onClick={onClick} role="button" tabIndex={0}
    aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'} onKeyDown={(event) => event.key === 'Enter' && onClick()} />;
}
