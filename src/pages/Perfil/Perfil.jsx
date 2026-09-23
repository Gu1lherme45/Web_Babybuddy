import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, KeyRound, ClipboardList } from 'lucide-react';
import styles from './Perfil.module.css';
import LogoutConfirm from '../../components/LogoutConfirm';
import artFallback from '../../assets/art3.png';
import useAuth from '../../auth/useAuth';
import { absoluteApiUrl } from '../../services/api';
import { listPublicMaterials } from '../../services/materialService';

export default function Perfil() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout } = useAuth();
  const displayName = user?.nome?.trim() || user?.username?.split('@')[0] || 'Usuária';
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const [materials, setMaterials] = useState([]);
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ nome: displayName, username: user?.username || '' });
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
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
  const featured = filtered[0] || materials[0];

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

      <section className={styles.healthCard} aria-labelledby="health-questionnaire-title">
        <div className={styles.healthIcon} aria-hidden="true">
          <ClipboardList size={26} />
        </div>
        <div className={styles.healthContent}>
          <span>Saúde e bem-estar</span>
          <h2 id="health-questionnaire-title">Questionário de saúde</h2>
          <p>Preencha quando quiser ou atualize suas respostas para manter o acompanhamento personalizado.</p>
        </div>
        <Link to="/questionario" className={styles.healthLink}>
          Preencher ou atualizar questionário
        </Link>
      </section>

      <label className={styles.searchContainer}>
        <Search size={18} strokeWidth={1.5} className={styles.searchIcon} />
        <input type="search" placeholder="Pesquisar artigos..." value={query} onChange={(e) => setQuery(e.target.value)} className={styles.searchInput} />
      </label>
      {message && <p className={styles.profileMessage} role="status">{message}</p>}

      {featured && <section className={styles.highlight}>
        <div className={styles.card}>
          <div className={styles.image}><img src={featured.imagem || featured.capa ? absoluteApiUrl(featured.imagem || featured.capa) : artFallback} alt={`Imagem de ${featured.titulo}`} /></div>
          <div className={styles.content}><span className={styles.category}>{featured.categoria}</span><h2>{featured.titulo}</h2>
            <p>{featured.descricao}</p><div className={styles.footer}><span>Por {featured.autor}</span>
              <Link to={materialPath(featured)} className={styles.button}>Ler agora</Link></div></div>
        </div>
      </section>}

      <section className={styles.artigosContainer}>
        <h2 className={styles.artigosTitle}>Artigos pensados para você</h2>
        <div className={styles.artigosGrid}>
          {filtered.map((material) => <Link key={material.id} to={materialPath(material)} className={styles.artigoCard} onClick={() => window.scrollTo(0, 0)}>
            <img src={material.imagem || material.capa ? absoluteApiUrl(material.imagem || material.capa) : artFallback} alt={`Imagem de ${material.titulo}`} />
            <div className={styles.cardContent}><span>{material.categoria.toUpperCase()}</span><h3>{material.titulo.toUpperCase()}</h3><p>{material.descricao}</p></div>
          </Link>)}
        </div>
      </section>

      {sidebarOpen && <><div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        <aside className={styles.sidebar} aria-label="Dados da conta">
          <button className={styles.fecharTopo} onClick={() => setSidebarOpen(false)} aria-label="Fechar perfil">×</button>
          <div className={styles.sidebarPerfil}><div className={styles.sidebarAvatar}>{avatarInitial}</div>
            <p>Usuária BabyBuddy</p><h2>{displayName}</h2>
            <button className={styles.editarPerfil} onClick={() => setEditing((value) => !value)}>{editing ? 'Cancelar' : 'Editar perfil'}</button>
          </div>
          <div className={styles.informacoesUsuario}>
            <ProfileField label="Nome completo" editing={editing} value={profile.nome} onChange={(value) => setProfile({ ...profile, nome: value })} />
            <ProfileField label="E-mail" editing={editing} value={profile.username} type="email" onChange={(value) => setProfile({ ...profile, username: value })} />
            <div className={styles.infoItem}><span>Senha</span>
              {!passwordOpen && <button type="button" className={styles.botaoAlterarSenha} onClick={() => setPasswordOpen(true)}><KeyRound size={15} /> Alterar senha</button>}
              {passwordOpen && <div className={styles.areaSenha}>
                <div className={styles.campoSenha}><input type="password" placeholder="Nova senha" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <div className={styles.campoSenha}><input type="password" placeholder="Confirmar nova senha" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} /></div>
                <div className={styles.acoesSenha}><button className={styles.cancelarSenha} onClick={() => setPasswordOpen(false)}>Cancelar</button>
                  <button className={styles.salvarSenha} onClick={savePassword}>Salvar nova senha</button></div>
              </div>}
            </div>
          </div>
          <div className={styles.acoesSidebar}>
            {editing ? <button className={styles.salvarAlteracoes} onClick={saveProfile}>Salvar alterações</button>
              : <button className={styles.sairConta} onClick={() => setConfirmLogout(true)}>Sair da conta</button>}
          </div>
        </aside></>}

      {confirmLogout && <div className={styles.overlayConfirmarSaida}><LogoutConfirm onConfirm={signOut} onCancel={() => setConfirmLogout(false)} /></div>}
    </div>
  );
}

function materialPath(material) {
  return material.arquivo ? `/artigos/${material.id}` : material.link || `/artigos/${material.id}`;
}

function ProfileField({ label, editing, value, onChange, type = 'text' }) {
  return <div className={styles.infoItem}><span>{label}</span>{editing
    ? <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    : <p>{value}</p>}</div>;
}
