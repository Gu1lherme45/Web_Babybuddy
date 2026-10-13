import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, KeyRound, ClipboardList, ChevronLeft, Eye, EyeOff, User, Pencil } from 'lucide-react';
import styles from './Perfil.module.css';
import useIsMobile from '../../hooks/useIsMobile';
import LogoutConfirm from '../../components/LogoutConfirm';
import artFallback from '../../assets/art3.png';
import artCuidados from '../../assets/art1.png';
import artEngravidar from '../../assets/art2.png';
import artGestacional from '../../assets/art3.png';
import artAlimentacao from '../../assets/art5.png';
import useAuth from '../../auth/useAuth';
import { absoluteApiUrl } from '../../services/api';
import { listPublicMaterials } from '../../services/materialService';

function semAcentos(texto) {
  return (texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('pt-BR');
}

function fallbackImagePorTema(material) {
  const texto = semAcentos(`${material.categoria} ${material.titulo} ${material.descricao || ''}`);
  if (texto.includes('aliment')) return artAlimentacao;
  if (texto.includes('engravid') || texto.includes('fertil')) return artEngravidar;
  if (texto.includes('cuidado') || texto.includes('bebe')) return artCuidados;
  if (texto.includes('gesta')) return artGestacional;
  return artFallback;
}

function materialImageSrc(material) {
  const source = material.imagem || material.capa;
  if (!source) return fallbackImagePorTema(material);
  return absoluteApiUrl(source);
}

export default function Perfil() {
  const navigate = useNavigate();
  const isMobile = useIsMobile(900);
  const { user, updateProfile, changePassword, logout } = useAuth();
  const displayName = user?.nome?.trim() || user?.username?.split('@')[0] || 'Usuária';
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const [materials, setMaterials] = useState([]);
  const [destaqueSlot, setDestaqueSlot] = useState(slotDestaqueAtual);
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ nome: displayName, username: user?.username || '' });
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    listPublicMaterials().then(setMaterials).catch(() => setMessage('Não foi possível carregar os artigos.'));
  }, []);

  useEffect(() => setProfile({ nome: displayName, username: user?.username || '' }), [displayName, user?.username]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return materials.filter((item) => !normalized
      || `${item.titulo} ${item.categoria} ${item.descricao || ''}`.toLocaleLowerCase('pt-BR').includes(normalized));
  }, [materials, query]);
  const featured = materials.length ? materials[destaqueSlot % materials.length] : undefined;

  useEffect(() => {
    const proximaTroca = (destaqueSlot + 1) * INTERVALO_DESTAQUE_MS - Date.now();
    const timer = setTimeout(() => setDestaqueSlot(slotDestaqueAtual()), proximaTroca);
    return () => clearTimeout(timer);
  }, [destaqueSlot]);

  async function saveProfile() {
    try {
      await updateProfile(profile);
      setEditing(false);
      setMessage('Perfil atualizado.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Não foi possível atualizar o perfil.');
    }
  }

  async function savePassword() {
    if (password.length < 8) return setMessage('A senha deve ter ao menos 8 caracteres.');
    if (password !== confirmation) return setMessage('As senhas não coincidem.');
    try {
      await changePassword(password);
      setPassword(''); setConfirmation(''); setPasswordOpen(false);
      setMessage('Senha alterada com sucesso.');
    } catch { setMessage('Não foi possível alterar a senha.'); }
  }

  async function signOut() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div><h1 className={styles.title}>Olá, <span>{displayName}</span></h1>
          <p className={styles.subtitle}>Este é o seu espaço personalizado para acompanhar cada etapa dessa fase tão importante.</p></div>
        <button type="button" className={styles.avatar} onClick={() => setSidebarOpen(true)} aria-label="Abrir perfil">
          {avatarInitial}
        </button>
      </header>

      <label className={styles.searchContainer}>
        <Search size={18} strokeWidth={1.5} className={styles.searchIcon} />
        <input type="search" placeholder="Pesquisar artigos..." value={query} onChange={(e) => setQuery(e.target.value)} className={styles.searchInput} />
      </label>
      {message && <p className={styles.profileMessage} role="status">{message}</p>}

      {featured && <section className={styles.highlight}>
        {isMobile ? (
          <Link to={materialPath(featured)} className={styles.artigoCard} onClick={() => window.scrollTo(0, 0)}>
            <img src={materialImageSrc(featured)} alt={`Imagem de ${featured.titulo}`} />
            <div className={styles.cardContent}><span>{featured.categoria?.toUpperCase()}</span><h3>{featured.titulo.toUpperCase()}</h3><p>{featured.descricao}</p></div>
          </Link>
        ) : (
          <div className={styles.card}>
            <div className={styles.image}><img src={materialImageSrc(featured)} alt={`Imagem de ${featured.titulo}`} /></div>
            <div className={styles.content}><span className={styles.category}>{featured.categoria}</span><h2>{featured.titulo}</h2>
              <p>{featured.descricao}</p><div className={styles.footer}><span>Por {featured.autor}</span>
                <Link to={materialPath(featured)} className={styles.button}>Ler agora</Link></div></div>
          </div>
        )}
      </section>}

      <section className={styles.artigosContainer}>
        <h2 className={styles.artigosTitle}>Artigos pensados para você</h2>
        <div className={styles.artigosGrid}>
          {filtered.map((material) => <Link key={material.id} to={materialPath(material)} className={styles.artigoCard} onClick={() => window.scrollTo(0, 0)}>
            <img src={materialImageSrc(material)} alt={`Imagem de ${material.titulo}`} />
            <div className={styles.cardContent}><span>{material.categoria.toUpperCase()}</span><h3>{material.titulo.toUpperCase()}</h3><p>{material.descricao}</p></div>
          </Link>)}
        </div>
      </section>

      {sidebarOpen && <><div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        {passwordOpen ? (
        <aside className={styles.senhaTela} aria-label="Alterar senha">
          <div className={styles.senhaTopo}>
            <button type="button" className={styles.senhaVoltar} onClick={() => setPasswordOpen(false)} aria-label="Voltar">
              <ChevronLeft size={24} />
            </button>
            <h2 className={styles.senhaTitulo}>Alterar Senha</h2>
          </div>
          <div className={styles.senhaCorpo}>
            <label className={styles.senhaCampo}>
              <span>Nova senha</span>
              <div className={styles.senhaInputBox}>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <label className={styles.senhaCampo}>
              <span>Confirmar nova senha</span>
              <div className={styles.senhaInputBox}>
                <input type={showConfirmation ? 'text' : 'password'} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
                <button type="button" onClick={() => setShowConfirmation((value) => !value)} aria-label={showConfirmation ? 'Ocultar senha' : 'Mostrar senha'}>
                  {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <button type="button" className={styles.senhaSalvar} onClick={savePassword}>Salvar senha</button>
          </div>
        </aside>
        ) : editing ? (
        <aside className={styles.senhaTela} aria-label="Editar perfil">
          <div className={styles.senhaTopo}>
            <button type="button" className={styles.senhaVoltar} onClick={() => setEditing(false)} aria-label="Voltar">
              <ChevronLeft size={24} />
            </button>
            <h2 className={styles.senhaTitulo}>Editar Perfil</h2>
          </div>
          <div className={styles.senhaCorpo}>
            <label className={styles.senhaCampo}>
              <span>Nome completo</span>
              <div className={styles.senhaInputBox}>
                <input type="text" value={profile.nome} onChange={(e) => setProfile({ ...profile, nome: e.target.value })} />
              </div>
            </label>
            <label className={styles.senhaCampo}>
              <span>E-mail</span>
              <div className={styles.senhaInputBox}>
                <input type="email" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
              </div>
            </label>
            <button type="button" className={styles.senhaSalvar} onClick={saveProfile}>Salvar alterações</button>
          </div>
        </aside>
        ) : (
        <aside className={styles.sidebar} aria-label="Dados da conta">
          <button className={styles.fecharTopo} onClick={() => setSidebarOpen(false)} aria-label="Fechar perfil">×</button>
          <div className={styles.sidebarPerfil}>
            <div className={styles.perfilCard}>
              <div className={styles.sidebarAvatar}><User size={22} /></div>
              <div className={styles.perfilTexto}>
                <h2>{displayName}</h2>
                <a href={`mailto:${profile.username}`} className={styles.perfilEmail}>{profile.username}</a>
              </div>
            </div>
          </div>
          <div className={styles.informacoesUsuario}>
            <ProfileField label="Nome completo" editing={false} value={profile.nome} />
            <ProfileField label="E-mail" editing={false} value={profile.username} type="email" />
            <button type="button" className={styles.botaoAlterarSenha} onClick={() => setEditing(true)}><Pencil size={15} /> Editar perfil</button>
            <button type="button" className={styles.botaoAlterarSenha} onClick={() => navigate('/questionario')}><ClipboardList size={15} /> Revisar questionário</button>
            <button type="button" className={styles.botaoAlterarSenha} onClick={() => setPasswordOpen(true)}><KeyRound size={15} /> Alterar senha</button>
          </div>
          <div className={styles.acoesSidebar}>
            <button className={styles.sairConta} onClick={() => setConfirmLogout(true)}>Sair da conta</button>
          </div>
        </aside>
        )}
      </>}

      {confirmLogout && <div className={styles.overlayConfirmarSaida}><LogoutConfirm onConfirm={signOut} onCancel={() => setConfirmLogout(false)} /></div>}
    </div>
  );
}

// Rodízio do artigo em destaque: troca a cada 5 horas, sempre no mesmo horário fixo.
const INTERVALO_DESTAQUE_MS = 5 * 60 * 60 * 1000;

function slotDestaqueAtual() {
  return Math.floor(Date.now() / INTERVALO_DESTAQUE_MS);
}

function materialPath(material) {
  return material.arquivo ? `/artigos/${material.id}` : material.link || `/artigos/${material.id}`;
}

function ProfileField({ label, editing, value, onChange, type = 'text' }) {
  return <div className={styles.infoItem}><span>{label}</span>{editing
    ? <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    : <p>{value}</p>}</div>;
}
