import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Pencil, Trash2, Ban, CheckCircle2, Plus, LogOut } from 'lucide-react';
import styles from './Administrador.module.css';
import logo2 from '../../assets/logo2.svg';
import useAuth from '../../auth/useAuth';
import api, { absoluteApiUrl } from '../../services/api';
import { deleteMaterial, listAdminMaterials, setMaterialActive } from '../../services/materialService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState(0);
  const [state, setState] = useState({ loading: true, error: '' });
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setState({ loading: true, error: '' });
    try {
      const [materialData, userResponse] = await Promise.all([
        listAdminMaterials(),
        api.get('/api/usuarios').catch(() => ({ data: [] })),
      ]);
      setMaterials(materialData);
      setUsers(userResponse.data.length);
    } catch (error) {
      setState({ loading: false, error: error.response?.status === 403 ? 'Acesso administrativo negado.' : 'Não foi possível carregar o dashboard.' });
      return;
    }
    setState({ loading: false, error: '' });
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return materials.filter((item) => !normalized || `${item.titulo} ${item.categoria}`.toLocaleLowerCase('pt-BR').includes(normalized));
  }, [materials, query]);

  async function toggle(material) {
    setBusyId(material.id);
    try {
      const updated = await setMaterialActive(material.id, material.statusMaterial !== 'ATIVO');
      setMaterials((current) => current.map((item) => item.id === material.id ? updated : item));
    } catch {
      setState((current) => ({ ...current, error: 'Não foi possível alterar o status do artigo.' }));
    } finally { setBusyId(null); }
  }

  async function remove(material) {
    if (!window.confirm(`Excluir definitivamente “${material.titulo}”?`)) return;
    setBusyId(material.id);
    try {
      await deleteMaterial(material.id);
      setMaterials((current) => current.filter((item) => item.id !== material.id));
    } catch {
      setState((current) => ({ ...current, error: 'Não foi possível excluir o artigo.' }));
    } finally { setBusyId(null); }
  }

  async function signOut() {
    await logout();
    navigate('/login', { replace: true });
  }

  const activeCount = materials.filter((item) => item.statusMaterial === 'ATIVO').length;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}><div className={styles.logoIcon}><img src={logo2} alt="BabyBuddy" className={styles.logoImage} /></div></div>
        <div className={styles.menuArea}><nav className={styles.nav} aria-label="Administração">
          <button className={styles.active}><LayoutDashboard size={20} /> Artigos</button>
          <button type="button" onClick={signOut}><LogOut size={20} /> Sair</button>
        </nav></div>
      </aside>

      <main className={styles.content}>
        <header className={styles.topbar}>
          <div><h1>Dashboard Administrativo</h1><p>Gerencie os artigos publicados na plataforma.</p></div>
          <div className={styles.topActions}>
            <label className={styles.searchBox}><Search size={18} /><span className={styles.srOnly}>Pesquisar artigo</span>
              <input type="search" placeholder="Pesquisar artigo..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
            <div className={styles.profile} title={user?.nome}>{user?.nome?.charAt(0).toUpperCase() || 'A'}</div>
          </div>
        </header>

        <section className={styles.stats} aria-label="Resumo">
          <Stat label="Total de Artigos" value={materials.length} />
          <Stat label="Artigos Ativos" value={activeCount} />
          <Stat label="Inativos" value={materials.length - activeCount} />
          <Stat label="Usuários" value={users} />
        </section>

        <div className={styles.sectionHeader}>
          <div><h2>Gerenciamento de Artigos</h2><p>Todos os cards usam a mesma fonte de dados do catálogo público.</p></div>
          <button className={styles.addButton} onClick={() => navigate('/administrador/materiais/novo')}><Plus size={18} /> Novo Artigo</button>
        </div>

        <div className={styles.feedback} role="status" aria-live="polite">
          {state.loading && 'Carregando artigos...'}{state.error}
          {!state.loading && !state.error && filtered.length === 0 && 'Nenhum artigo encontrado.'}
        </div>

        <div className={styles.grid}>
          {filtered.map((material) => {
            const active = material.statusMaterial === 'ATIVO';
            return <article key={material.id} className={`${styles.card} ${!active ? styles.suspended : ''}`}>
              {material.imagem || material.capa ? <img src={absoluteApiUrl(material.imagem || material.capa)} alt={`Imagem de ${material.titulo}`} /> : <div className={styles.semImagem} aria-hidden="true">📄</div>}
              <div className={styles.cardContent}><span>{material.categoria}</span><h3>{material.titulo}</h3><p>{material.descricao || 'Sem descrição.'}</p>
                <div className={styles.statusArea}><div className={`${styles.status} ${active ? styles.activeStatus : styles.suspendedStatus}`}>{active ? 'ATIVO' : 'INATIVO'}</div></div>
              </div>
              <div className={styles.actions}>
                <button className={styles.editBtn} disabled={busyId === material.id} onClick={() => navigate(`/administrador/materiais/${material.id}/editar`)}><Pencil size={16} /> Editar</button>
                <button className={styles.suspendBtn} disabled={busyId === material.id} onClick={() => toggle(material)}>
                  {active ? <><Ban size={16} /> Inativar</> : <><CheckCircle2 size={16} /> Ativar</>}
                </button>
                <button className={styles.deleteBtn} disabled={busyId === material.id} onClick={() => remove(material)}><Trash2 size={16} /> Excluir</button>
              </div>
            </article>;
          })}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return <div className={styles.statCard}><h3>{label}</h3><strong>{value}</strong></div>;
}
