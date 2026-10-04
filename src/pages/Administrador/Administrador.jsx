import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Pencil, Trash2, Ban, CheckCircle2, Plus, LogOut, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Administrador.module.css';
import logo2 from '../../assets/logo2.svg';
import useAuth from '../../auth/useAuth';
import api, { absoluteApiUrl } from '../../services/api';
import { deleteMaterial, listAdminMaterials, setMaterialActive } from '../../services/materialService';

const VISIVEIS = 3;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState(0);
  const [state, setState] = useState({ loading: true, error: '' });
  const [busyId, setBusyId] = useState(null);
  const [indice, setIndice] = useState(0);
  const [transicao, setTransicao] = useState({ fase: 'estavel', direcao: null });
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

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

  const indiceSeguro = Math.min(indice, Math.max(filtered.length - VISIVEIS, 0));
  const visiveis = filtered.slice(indiceSeguro, indiceSeguro + VISIVEIS);
  const podeVoltar = indiceSeguro > 0;
  const podeAvancar = indiceSeguro < filtered.length - VISIVEIS;
  const classeTransicao = transicao.fase === 'estavel' ? ''
    : transicao.fase === 'saindo'
      ? (transicao.direcao === 'proximo' ? styles.saindoProximo : styles.saindoAnterior)
      : (transicao.direcao === 'proximo' ? styles.entrandoProximo : styles.entrandoAnterior);

  function trocarCard(direcao) {
    const proximo = indiceSeguro + (direcao === 'proximo' ? 1 : -1);
    if (transicao.fase === 'saindo' || proximo < 0 || proximo > filtered.length - VISIVEIS) return;
    setTransicao({ fase: 'saindo', direcao });
    timerRef.current = setTimeout(() => {
      setIndice(proximo);
      setTransicao({ fase: 'entrando', direcao });
    }, 250);
  }

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

 

  const activeCount = materials.filter((item) => item.statusMaterial === 'ATIVO').length;

  return (
    <div className={styles.container}>
    

      <main className={styles.content}>
        <header className={styles.topbar}>
          <div className={styles.titleGroup}>
            <button type="button" className={styles.backButton} onClick={() => navigate('/')} aria-label="Voltar para a página inicial"><ArrowLeft size={20} /></button>
            <div><h1>Dashboard Administrativo</h1><p>Gerencie os artigos publicados na plataforma.</p></div>
          </div>
          <div className={styles.topActions}>
            <label className={styles.searchBox}><Search size={18} /><span className={styles.srOnly}>Pesquisar artigo</span>
              <input type="search" placeholder="Pesquisar artigo..." value={query} onChange={(event) => { setQuery(event.target.value); setIndice(0); }} /></label>
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

        <div className={styles.carrossel}>
          <button type="button" className={`${styles.setaCarrossel} ${podeVoltar ? '' : styles.setaOculta}`} onClick={() => trocarCard('anterior')} aria-label="Artigo anterior"><ChevronLeft size={22} /></button>

          <div className={styles.carrosselArea}>
            <div key={indiceSeguro} className={`${styles.janela} ${classeTransicao}`}>
              {visiveis.map((material) => {
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
          </div>

          <button type="button" className={styles.setaCarrossel} disabled={!podeAvancar} onClick={() => trocarCard('proximo')} aria-label="Próximo artigo"><ChevronRight size={22} /></button>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return <div className={styles.statCard}><h3>{label}</h3><strong>{value}</strong></div>;
}
