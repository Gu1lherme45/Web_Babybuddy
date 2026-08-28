import { useEffect, useState } from "react";
import styles from "./Administrador.module.css";
import {
  LayoutDashboard,
  Search,
  Pencil,
  Trash2,
  Ban,
  CheckCircle2,
  Plus,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  listarMateriais,
  criarMaterial,
  atualizarMaterial,
  inativarMaterial,
  ativarMaterial,
  excluirMaterial,
  listarUsuarios,
  ApiError,
} from "../../services/api";

// Imagens
import art1 from "../../assets/art1.png";
import art2 from "../../assets/art2.png";
import art3 from "../../assets/art3.png";
import art5 from "../../assets/art5.png";
import art6 from "../../assets/art6.png";
import logo2 from "../../assets/logo2.svg";

// imagem padrão só para os artigos de conteúdo fixo do site — os demais
// usam o que estiver salvo em `arquivo` (upload feito no modal de edição)
const IMAGENS_POR_ROTA = {
  "/cuidados-bebe": art1,
  "/tentando-engravidar": art2,
  "/periodo-gestacional": art3,
  "/artigos/sono": art6,
  "/artigos/alimentacao": art5,
};

// Material (backend) -> formato usado pela grade do dashboard
function materialParaArtigo(material) {
  return {
    id: material.id,
    titulo: material.titulo,
    categoria: material.categoria,
    descricao: material.descricao,
    imagem: material.arquivo || IMAGENS_POR_ROTA[material.link] || "",
    arquivo: material.arquivo,
    status: material.statusMaterial === "ATIVO" ? "ativo" : "suspenso",
    rota: material.link,
    autor: material.autor,
    statusMaterial: material.statusMaterial,
  };
}

export default function AdminDashboard() {
  const { usuario } = useAuth();
  const admin = usuario?.nome || "Administrador";

  const [artigos, setArtigos] = useState([]);
  const [carregandoArtigos, setCarregandoArtigos] = useState(true);
  const [erroArtigos, setErroArtigos] = useState("");

  const [pesquisa, setPesquisa] = useState("");
  const [totalUsuarios, setTotalUsuarios] = useState(0);

  // Modal de edição
  const [modalEditar, setModalEditar] = useState(false);
  const [artigoEditando, setArtigoEditando] = useState(null);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [novaImagem, setNovaImagem] = useState("");
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  // Busca os materiais (artigos) no backend
  useEffect(() => {
    async function carregarMateriais() {
      try {
        const materiais = await listarMateriais();
        setArtigos(materiais.map(materialParaArtigo));
      } catch (error) {
        setErroArtigos(
          error instanceof ApiError
            ? error.message
            : "Não foi possível carregar os artigos."
        );
      } finally {
        setCarregandoArtigos(false);
      }
    }

    carregarMateriais();
  }, []);

  // Busca total de usuários no backend
  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const usuarios = await listarUsuarios();
        setTotalUsuarios(usuarios.length);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }

    carregarUsuarios();
  }, []);

  function editarArtigo(id) {
    const artigo = artigos.find((a) => a.id === id);
    if (!artigo) return;

    setArtigoEditando(artigo);
    setNovoTitulo(artigo.titulo);
    setNovaDescricao(artigo.descricao);
    setNovaCategoria(artigo.categoria);
    // preview usa o fallback de imagem, mas o que é persistido é o
    // `arquivo` real — não o caminho de um asset local usado só de exibição
    setNovaImagem(artigo.arquivo || "");
    setModalEditar(true);
  }

  async function salvarEdicao() {
    setSalvandoEdicao(true);

    try {
      const atualizado = await atualizarMaterial(artigoEditando.id, {
        titulo: novoTitulo,
        descricao: novaDescricao,
        categoria: novaCategoria,
        link: artigoEditando.rota,
        arquivo: novaImagem || null,
        autor: artigoEditando.autor,
        statusMaterial: artigoEditando.statusMaterial,
      });

      const artigoAtualizado = materialParaArtigo(atualizado);

      setArtigos((atual) =>
        atual.map((artigo) =>
          artigo.id === artigoAtualizado.id ? artigoAtualizado : artigo
        )
      );
      setModalEditar(false);
    } catch (error) {
      setErroArtigos(
        error instanceof ApiError
          ? error.message
          : "Não foi possível salvar o artigo."
      );
    } finally {
      setSalvandoEdicao(false);
    }
  }

  function carregarImagemEdicao(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setNovaImagem(reader.result);
    reader.readAsDataURL(file);
  }

  async function excluirArtigo(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este artigo?"
    );
    if (!confirmar) return;

    try {
      await excluirMaterial(id);
      setArtigos((atual) => atual.filter((artigo) => artigo.id !== id));
    } catch (error) {
      setErroArtigos(
        error instanceof ApiError
          ? error.message
          : "Não foi possível excluir o artigo."
      );
    }
  }

  async function suspenderArtigo(id) {
    const artigo = artigos.find((a) => a.id === id);
    if (!artigo) return;

    try {
      const atualizado =
        artigo.status === "ativo"
          ? await inativarMaterial(id)
          : await ativarMaterial(id);

      const artigoAtualizado = materialParaArtigo(atualizado);
      setArtigos((atual) =>
        atual.map((a) => (a.id === id ? artigoAtualizado : a))
      );
    } catch (error) {
      setErroArtigos(
        error instanceof ApiError
          ? error.message
          : "Não foi possível alterar o status do artigo."
      );
    }
  }

  async function adicionarArtigo() {
    try {
      const criado = await criarMaterial({
        titulo: "Novo artigo",
        descricao: "Descrição do novo artigo.",
        categoria: "Categoria",
        link: "/",
        arquivo: null,
        autor: admin,
      });

      setArtigos((atual) => [materialParaArtigo(criado), ...atual]);
    } catch (error) {
      setErroArtigos(
        error instanceof ApiError
          ? error.message
          : "Não foi possível criar o artigo."
      );
    }
  }

  const artigosFiltrados = artigos.filter((artigo) =>
    artigo.titulo.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <img src={logo2} alt="BabyBuddy" className={styles.logoImage} />
          </div>
        </div>

        <div className={styles.menuArea}>
          <nav className={styles.nav}>
            <button className={styles.active}>
              <LayoutDashboard size={20} />
              Artigos
            </button>

            <button className={styles.active}>
              <LayoutDashboard size={20} />
              Usuários
            </button>

            <button className={styles.active}>
              <LayoutDashboard size={20} />
              Dashboard
            </button>
          </nav>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className={styles.content}>
        {/* TOPBAR */}
        <header className={styles.topbar}>
          <div>
            <h1>Dashboard Administrativo</h1>
            <p>Gerencie artigos, usuários e conteúdos da plataforma.</p>
          </div>

          <div className={styles.topActions}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Pesquisar artigo..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />
            </div>

            <div className={styles.profile}>
              {admin.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {erroArtigos && <p className={styles.erroArtigos}>{erroArtigos}</p>}

        {/* STATS */}
        <section className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Total de Artigos</h3>
            <strong>{artigos.length}</strong>
          </div>

          <div className={styles.statCard}>
            <h3>Artigos Ativos</h3>
            <strong>
              {artigos.filter((a) => a.status === "ativo").length}
            </strong>
          </div>

          <div className={styles.statCard}>
            <h3>Suspensos</h3>
            <strong>
              {artigos.filter((a) => a.status === "suspenso").length}
            </strong>
          </div>

          <div className={styles.statCard}>
            <h3>Usuários</h3>
            <strong>{totalUsuarios}</strong>
          </div>
        </section>

        {/* HEADER DA LISTA */}
        <div className={styles.sectionHeader}>
          <div>
            <h2>Gerenciamento de Artigos</h2>
            <p>Controle completo dos conteúdos publicados.</p>
          </div>

          <button className={styles.addButton} onClick={adicionarArtigo}>
            <Plus size={18} />
            Novo Artigo
          </button>
        </div>

        {/* GRID DE ARTIGOS */}
        {carregandoArtigos ? (
          <p>Carregando artigos...</p>
        ) : (
          <div className={styles.grid}>
            {artigosFiltrados.map((artigo) => (
              <div
                key={artigo.id}
                className={`${styles.card} ${
                  artigo.status === "suspenso" ? styles.suspended : ""
                }`}
              >
                {artigo.imagem ? (
                  <img src={artigo.imagem} alt={artigo.titulo} />
                ) : (
                  <div className={styles.semImagem}>📷</div>
                )}

                <div className={styles.cardContent}>
                  <span>{artigo.categoria}</span>
                  <h3>{artigo.titulo}</h3>
                  <p>{artigo.descricao}</p>

                  <div className={styles.statusArea}>
                    <div
                      className={`${styles.status} ${
                        artigo.status === "ativo"
                          ? styles.activeStatus
                          : styles.suspendedStatus
                      }`}
                    >
                      {artigo.status === "ativo" ? "ATIVO" : "SUSPENSO"}
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => editarArtigo(artigo.id)}
                  >
                    <Pencil size={16} />
                    Editar
                  </button>

                  <button
                    className={styles.suspendBtn}
                    onClick={() => suspenderArtigo(artigo.id)}
                  >
                    {artigo.status === "ativo" ? (
                      <>
                        <Ban size={16} />
                        Suspender
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        Ativar
                      </>
                    )}
                  </button>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => excluirArtigo(artigo.id)}
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL DE EDIÇÃO */}
        {modalEditar && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2>Editar artigo</h2>
                <p>Altere as informações do artigo.</p>
              </div>

              <div className={styles.modalForm}>
                <div className={styles.modalGroup}>
                  <label>Titulo do artigo</label>
                  <input
                    type="text"
                    value={novoTitulo}
                    onChange={(e) => setNovoTitulo(e.target.value)}
                  />
                </div>

                <div className={styles.modalGroup}>
                  <label>Adicone a categoria</label>
                  <input
                    type="text"
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                  />
                </div>

                <div className={styles.modalGroup}>
                  <label>Alterar descrição</label>
                  <textarea
                    value={novaDescricao}
                    onChange={(e) => setNovaDescricao(e.target.value)}
                  />
                </div>

                <div className={styles.modalGroup}>
                  <label htmlFor="imagemUpload" className={styles.uploadArea}>
                    <span>📷</span>
                    <h4>Adicionar imagem</h4>
                    <p>Clique para selecionar</p>
                  </label>

                  <input
                    id="imagemUpload"
                    type="file"
                    accept="image/*"
                    onChange={carregarImagemEdicao}
                    hidden
                  />
                </div>

                <div className={styles.modalButtons}>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setModalEditar(false)}
                  >
                    Cancelar
                  </button>

                  <button
                    className={styles.saveBtn}
                    onClick={salvarEdicao}
                    disabled={salvandoEdicao}
                  >
                    {salvandoEdicao ? "Salvando..." : "Salvar artigo"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
