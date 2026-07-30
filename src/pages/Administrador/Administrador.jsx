import styles from "./Administrador.module.css";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  FileText,
  Users,
  ShieldCheck,
  Search,
  Pencil,
  Trash2,
  Ban,
  CheckCircle2,
  Plus,
  Settings,
  CalendarHeart,
} from "lucide-react";

// imagens
import art1 from "../../assets/art1.png";
import art2 from "../../assets/art2.png";
import art3 from "../../assets/art3.png";
import logo2 from "../../assets/logo2.svg";



export default function AdminDashboard() {
  const admin =
    localStorage.getItem("nome") ||
    "Administrador";

  // ARTIGOS PADRÃO
  const artigosPadrao = [
    {
      id: 1,
      titulo: "Cuidados com o bebê",
      categoria: "Bebê",
      descricao:
        "Tudo que você precisa saber para cuidar do seu bebê.",
      imagem: art1,
      status: "ativo",
      rota: "/cuidados-bebe",
    },

    {
      id: 2,
      titulo: "Tentando engravidar?",
      categoria: "Fertilidade",
      descricao:
        "Quanto tempo demora a fecundação após a relação sexual?",
      imagem: art2,
      status: "ativo",
      rota: "/tentando-engravidar",
    },

    {
      id: 3,
      titulo: "Período gestacional",
      categoria: "Gestação",
      descricao:
        "Tudo que você precisa saber sobre o período gestacional.",
      imagem: art3,
      status: "ativo",
      rota: "/periodo-gestacional",
    },
  ];










  // STORAGE
  const [artigos, setArtigos] = useState(() => {
    const artigosSalvos = JSON.parse(
      localStorage.getItem("artigos")
    );

    if (
      !artigosSalvos ||
      artigosSalvos.length === 0
    ) {
      localStorage.setItem(
        "artigos",
        JSON.stringify(artigosPadrao)
      );

      return artigosPadrao;
    }

    return artigosSalvos;
  });



 const [pesquisa, setPesquisa] =
  useState("");

const [totalUsuarios, setTotalUsuarios] =
  useState(0);

  // MODAL
  const [modalEditar, setModalEditar] =
    useState(false);

  const [artigoEditando, setArtigoEditando] =
    useState(null);

  const [novoTitulo, setNovoTitulo] =
    useState("");

  const [novaDescricao, setNovaDescricao] =
    useState("");

  const [novaCategoria, setNovaCategoria] =
    useState("");

  const [novaImagem, setNovaImagem] =
  useState("");










  // SALVA STORAGE
  useEffect(() => {
    localStorage.setItem(
      "artigos",
      JSON.stringify(artigos)
    );

    window.dispatchEvent(
      new Event("artigosAtualizados")
    );
  }, [artigos]);











// BUSCA USUÁRIOS DO BANCO
useEffect(() => {
  async function carregarUsuarios() {
    try {
      const response = await fetch(
        "http://localhost:8080/api/usuarios"
      );

      if (!response.ok) return;

      const usuarios =
        await response.json();

      setTotalUsuarios(
        usuarios.length
      );
    } catch (error) {
      console.error(
        "Erro ao buscar usuários:",
        error
      );
    }
  }

  carregarUsuarios();
}, []);










  // EDITAR
  function editarArtigo(id) {
    const artigo =
      artigos.find((a) => a.id === id);

    if (!artigo) return;

    setArtigoEditando(artigo);

    setNovoTitulo(artigo.titulo);

    setNovaDescricao(
      artigo.descricao
    );

    setNovaCategoria(
      artigo.categoria
    );

    setNovaImagem(
      artigo.imagem
    );

    setModalEditar(true);
  }










  // SALVAR EDIÇÃO
  function salvarEdicao() {
    const artigosAtualizados =
      artigos.map((artigo) =>
        artigo.id ===
        artigoEditando.id
          ?  {
    ...artigo,
    titulo: novoTitulo,
    descricao: novaDescricao,
    categoria: novaCategoria,
    imagem: novaImagem,
  }
          : artigo
      );

    setArtigos(artigosAtualizados);

    localStorage.setItem(
      "artigos",
      JSON.stringify(
        artigosAtualizados
      )
    );

    window.dispatchEvent(
      new Event("artigosAtualizados")
    );

    setModalEditar(false);
  }

  function carregarImagemEdicao(event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    setNovaImagem(reader.result);
  };

  reader.readAsDataURL(file);
}











  // ALTERAR IMAGEM
  // eslint-disable-next-line no-unused-vars
  function alterarImagem(id, event) {
    const file = event.target.files[0];

    if (!file) return;

    const imageUrl =
      URL.createObjectURL(file);

    const artigosAtualizados =
      artigos.map((artigo) =>
        artigo.id === id
          ? {
              ...artigo,
              imagem: imageUrl,
            }
          : artigo
      );

    setArtigos(artigosAtualizados);
  }











  // EXCLUIR
  function excluirArtigo(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este artigo?"
    );

    if (!confirmar) return;

    const artigosAtualizados =
      artigos.filter(
        (artigo) => artigo.id !== id
      );

    setArtigos(artigosAtualizados);
  }









  // SUSPENDER
  function suspenderArtigo(id) {
    const artigosAtualizados =
      artigos.map((artigo) =>
        artigo.id === id
          ? {
              ...artigo,
              status:
                artigo.status ===
                "ativo"
                  ? "suspenso"
                  : "ativo",
            }
          : artigo
      );

    setArtigos(artigosAtualizados);
  }









  // NOVO ARTIGO
  function adicionarArtigo() {
    const novoArtigo = {
      id: Date.now(),
      titulo: "Novo artigo",
      categoria: "Categoria",
      descricao:
        "Descrição do novo artigo.",
      imagem: "" ,
      status: "ativo",
      rota: "/",
    };

    setArtigos([
      novoArtigo,
      ...artigos,
    ]);
  }









  // PESQUISA
  const artigosFiltrados =
    artigos.filter((artigo) =>
      artigo.titulo
        .toLowerCase()
        .includes(
          pesquisa.toLowerCase()
        )
    );








  return (


    <div className={styles.container}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
  <img
    src={logo2}
    alt="BabyBuddy"
    className={styles.logoImage}
  />
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
            <h1>
              Dashboard Administrativo
            </h1>

            <p>
              Gerencie artigos,
              usuários e conteúdos da
              plataforma.
            </p>
          </div>




          <div className={styles.topActions}>
            <div
              className={styles.searchBox}
            >
              <Search size={18} />

              <input
                type="text"
                placeholder="Pesquisar artigo..."
                value={pesquisa}
                onChange={(e) =>
                  setPesquisa(
                    e.target.value
                  )
                }
              />
            </div>

            <div className={styles.profile}>
              {admin
                .charAt(0)
                .toUpperCase()}
            </div>
          </div>
        </header>









        {/* STATS */}
        <section className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Total de Artigos</h3>

            <strong>
              {artigos.length}
            </strong>
          </div>

          <div className={styles.statCard}>
            <h3>Artigos Ativos</h3>

            <strong>
              {
                artigos.filter(
                  (a) =>
                    a.status ===
                    "ativo"
                ).length
              }
            </strong>
          </div>

          <div className={styles.statCard}>
            <h3>Suspensos</h3>

            <strong>
              {
                artigos.filter(
                  (a) =>
                    a.status ===
                    "suspenso"
                ).length
              }
            </strong>
          </div>

         <div className={styles.statCard}>
  <h3>Usuários</h3>
       <strong>
        {totalUsuarios}
      </strong>

    </div>
        </section>







        {/* HEADER */}
        <div className={styles.sectionHeader}>
          <div>
            <h2>
              Gerenciamento de Artigos
            </h2>

            <p>
              Controle completo dos
              conteúdos publicados.
            </p>
          </div>

          <button
            className={styles.addButton}
            onClick={adicionarArtigo}
          >
            <Plus size={18} />
            Novo Artigo
          </button>
        </div>








        {/* GRID */}
        <div className={styles.grid}>
          {artigosFiltrados.map(
            (artigo) => (
              <div
                key={artigo.id}
                className={`${styles.card} ${
                  artigo.status ===
                  "suspenso"
                    ? styles.suspended
                    : ""
                }`}
              >
 {artigo.imagem ? (
  <img
    src={artigo.imagem}
    alt={artigo.titulo}
  />
) : (
  <div className={styles.semImagem}>
    📷
  </div>
)}

                <div
                  className={
                    styles.cardContent
                  }
                >
                  <span>
                    {artigo.categoria}
                  </span>

                  <h3>
                    {artigo.titulo}
                  </h3>

                  <p>
                    {artigo.descricao}
                  </p>

                  <div
                    className={
                      styles.statusArea
                    }
                  >
                    <div
                      className={`${styles.status} ${
                        artigo.status ===
                        "ativo"
                          ? styles.activeStatus
                          : styles.suspendedStatus
                      }`}
                    >
                      {artigo.status ===
                      "ativo"
                        ? "ATIVO"
                        : "SUSPENSO"}
                    </div>
                  </div>
                </div>







                {/* BOTÕES */}
                <div
                  className={
                    styles.actions
                  }
                >
                  <button
                    className={
                      styles.editBtn
                    }
                    onClick={() =>
                      editarArtigo(
                        artigo.id
                      )
                    }
                  >
                    <Pencil size={16} />
                    Editar
                  </button>

                 

                  <button
                    className={
                      styles.suspendBtn
                    }
                    onClick={() =>
                      suspenderArtigo(
                        artigo.id
                      )
                    }
                  >
                    {artigo.status ===
                    "ativo" ? (
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
                    className={
                      styles.deleteBtn
                    }
                    onClick={() =>
                      excluirArtigo(
                        artigo.id
                      )
                    }
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </div>
              </div>
            )
          )}
        </div>









        {/* MODAL */}
        {modalEditar && (
          <div
            className={
              styles.modalOverlay
            }
          >
            <div className={styles.modal}>
              <div
                className={
                  styles.modalHeader
                }
              >
                <h2>
                  Editar artigo
                </h2>

                <p>
                  Altere as informações
                  do artigo.
                </p>
              </div>

              <div
                className={
                  styles.modalForm
                }
              >
                <div
                  className={
                    styles.modalGroup
                  }
                >
                  <label>
                   Titulo do artigo
                  </label>

                  <input
                    type="text"
                    value={novoTitulo}
                    onChange={(e) =>
                      setNovoTitulo(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div
                  className={
                    styles.modalGroup
                  }
                >
                  <label>
                    Adicone a categoria 
                  </label>

                  <input
                    type="text"
                    value={
                      novaCategoria
                    }
                    onChange={(e) =>
                      setNovaCategoria(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div
                  className={
                    styles.modalGroup
                  }
                >
                  <label>
                    Alterar descrição
                  </label>

                  <textarea
                    value={
                      novaDescricao
                    }
                    onChange={(e) =>
                      setNovaDescricao(
                        e.target.value
                      )
                    }
                  />
                </div>
                <div
  className={
    styles.modalGroup
  }
>


  
<label
  htmlFor="imagemUpload"
  className={styles.uploadArea}
>
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
                

                <div
                  className={
                    styles.modalButtons
                  }
                >
                  <button
                    className={
                      styles.cancelBtn
                    }
                    onClick={() =>
                      setModalEditar(
                        false
                      )
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    className={
                      styles.saveBtn
                    }
                    onClick={
                      salvarEdicao
                    }
                  >
                    Salvar artigo
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