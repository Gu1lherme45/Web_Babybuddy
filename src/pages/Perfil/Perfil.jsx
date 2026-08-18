import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarHeart, Search, Eye, EyeOff, KeyRound } from "lucide-react";

import styles from "./Perfil.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import LogoutConfirm from "../../components/LogoutConfirm";

import art1 from "../../assets/art1.png";
import art2 from "../../assets/art2.png";
import art3 from "../../assets/art3.png";
import artSono from "../../assets/art6.png";
import artAlimentacao from "../../assets/art5.png";

export default function Perfil() {
  const navigate = useNavigate();

  const usuario =
    JSON.parse(localStorage.getItem("usuario")) || {
      nome: "Usuario Nome",
      email: "Usuario@email.com",
      senha: "123456",
    };

  const nomeUsuario = usuario.nome;

  // ARTIGOS PADRÃO
  const artigosPadrao = [
    {
      id: 1,
      titulo: "Cuidados com o bebê",
      categoria: "Bebê",
      descricao: "Tudo que você precisa saber para cuidar do seu bebê.",
      imagem: art1,
      status: "ativo",
      rota: "/cuidados-bebe",
    },
    {
      id: 2,
      titulo: "Tentando engravidar?",
      categoria: "Fertilidade",
      descricao: "Quanto tempo demora a fecundação após a relação sexual?",
      imagem: art2,
      status: "ativo",
      rota: "/tentando-engravidar",
    },
    {
      id: 3,
      titulo: "Período gestacional",
      categoria: "Gestação",
      descricao: "Tudo que você precisa saber sobre o período gestacional!",
      imagem: art3,
      status: "ativo",
      rota: "/periodo-gestacional",
    },
    {
      id: 4,
      titulo: "Sono do bebê",
      categoria: "Sono",
      descricao: "Rotina, fases e dicas para o bebê dormir a noite toda.",
      imagem: artSono,
      status: "ativo",
      rota: "/artigos/sono",
    },
    {
      id: 5,
      titulo: "Alimentação do bebê",
      categoria: "Alimentação",
      descricao: "Do aleitamento à introdução alimentar, passo a passo.",
      imagem: artAlimentacao,
      status: "ativo",
      rota: "/artigos/alimentacao",
    },
  ];

  const [artigos, setArtigos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [editando, setEditando] = useState(false);
  const [dadosUsuario, setDadosUsuario] = useState(usuario);
  const [alterarSenha, setAlterarSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");
  const [confirmarSaida, setConfirmarSaida] = useState(false);

  function sairDaConta() {
    localStorage.removeItem("usuario");
    setConfirmarSaida(false);
    navigate("/");
  }

  // CARREGAR ARTIGOS
  function carregarArtigos() {
    let artigosStorage = JSON.parse(localStorage.getItem("artigos"));

    // cria os artigos caso não existam
    if (!artigosStorage || artigosStorage.length === 0) {
      localStorage.setItem("artigos", JSON.stringify(artigosPadrao));
      artigosStorage = artigosPadrao;
    }

    // GARANTE ROTAS E STATUS
    artigosStorage = artigosStorage.map((artigo) => {
      // sono (checar antes de "bebê", pois "Sono do bebê" contém a palavra)
      if (artigo.titulo.toLowerCase().includes("sono")) {
        return {
          ...artigo,
          rota: "/artigos/sono",
          status: artigo.status || "ativo",
        };
      }

      // alimentação (checar antes de "bebê", pelo mesmo motivo)
      if (artigo.titulo.toLowerCase().includes("alimenta")) {
        return {
          ...artigo,
          rota: "/artigos/alimentacao",
          status: artigo.status || "ativo",
        };
      }

      // bebê
      if (artigo.titulo.toLowerCase().includes("bebê")) {
        return {
          ...artigo,
          rota: "/cuidados-bebe",
          status: artigo.status || "ativo",
        };
      }

      // engravidar
      if (artigo.titulo.toLowerCase().includes("engravidar")) {
        return {
          ...artigo,
          rota: "/tentando-engravidar",
          status: artigo.status || "ativo",
        };
      }

      // gestacional
      if (artigo.titulo.toLowerCase().includes("gestacional")) {
        return {
          ...artigo,
          rota: "/periodo-gestacional",
          status: artigo.status || "ativo",
        };
      }

      return artigo;
    });

    // atualiza storage
    localStorage.setItem("artigos", JSON.stringify(artigosStorage));

    // somente ativos
    const ativos = artigosStorage.filter((artigo) => artigo.status === "ativo");

    setArtigos(ativos);
  }

  useEffect(() => {
    // LIMPA STORAGE ANTIGO
    carregarArtigos();

    window.addEventListener("artigosAtualizados", carregarArtigos);

    return () => {
      window.removeEventListener("artigosAtualizados", carregarArtigos);
    };
  }, []);

  const artigosFiltrados = artigos.filter(
    (artigo) =>
      artigo.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
      artigo.categoria.toLowerCase().includes(pesquisa.toLowerCase()) ||
      artigo.descricao.toLowerCase().includes(pesquisa.toLowerCase())
  );

  function salvarAlteracoes() {
    localStorage.setItem("usuario", JSON.stringify(dadosUsuario));
    setEditando(false);
  }

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Olá, <span>{nomeUsuario} </span>
          </h1>

          <p className={styles.subtitle}>
            Este é o seu espaço personalizado dentro do BabyBuddy, criado para
            acompanhar cada etapa dessa fase tão importante.
          </p>
        </div>

        <div className={styles.avatar} onClick={() => setSidebarOpen(true)}>
          {nomeUsuario.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className={styles.searchContainer}>
        <Search size={18} strokeWidth={1.5} className={styles.searchIcon} />

        <input
          type="text"
          placeholder="Pesquisar artigos..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* DESTAQUE */}
      <section className={styles.highlight}>
        <div className={styles.card}>
          <div className={styles.image}>
            <img src={art3} alt="Artigo em destaque" />
          </div>

          <div className={styles.content}>
            <span className={styles.category}>DESENVOLVIMENTO</span>

            <h2>Período Gestacional: Transformações e Cuidados na Gravidez</h2>

            <p>
              O período gestacional é a fase da gravidez em que ocorrem
              mudanças no corpo da mulher e o desenvolvimento do bebê, sendo
              essencial o acompanhamento e os cuidados com a saúde.
            </p>

            <div className={styles.footer}>
              <span>6 min de leitura</span>
              <span>•</span>
              <span>Equipe Materna</span>

              <Link to="/periodo-gestacional" className={styles.button}>
                Ler agora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ARTIGOS */}
      <div className={styles.artigosContainer}>
        <h2 className={styles.artigosTitle}>Artigos pensados para você</h2>

        <div className={styles.artigosGrid}>
          {artigosFiltrados.map((artigo) => (
            <Link
              key={artigo.id}
              to={artigo.rota || "/"}
              className={styles.artigoCard}
              onClick={() => window.scrollTo(0, 0)}
            >
              <img src={artigo.imagem} alt={artigo.titulo} />

              <div className={styles.cardContent}>
                <span>{artigo.categoria.toUpperCase()}</span>
                <h3>{artigo.titulo.toUpperCase()}</h3>
                <p>{artigo.descricao}</p>
              </div>
            </Link>
          ))}
        </div>

        {sidebarOpen && (
          <>
            <div
              className={styles.overlay}
              onClick={() => setSidebarOpen(false)}
            />

            <div className={styles.sidebar}>
              <button
                className={styles.fecharTopo}
                onClick={() => setSidebarOpen(false)}
              >
                ×
              </button>

              {/* PERFIL DO USUÁRIO */}
              <div className={styles.sidebarPerfil}>
                <div className={styles.sidebarAvatar}>
                  {nomeUsuario.charAt(0).toUpperCase()}
                </div>

                <p>Usuária BabyBuddy</p>

                <h2>{nomeUsuario}</h2>

                <button
                  className={styles.editarPerfil}
                  onClick={() => setEditando(!editando)}
                >
                  {editando ? "Cancelar" : "Editar perfil"}
                </button>
              </div>

              {/* INFORMAÇÕES DO USUÁRIO */}
              <div className={styles.informacoesUsuario}>
                <div className={styles.infoItem}>
                  <span>Nome completo</span>

                  {editando ? (
                    <input
                      value={dadosUsuario.nome}
                      onChange={(e) =>
                        setDadosUsuario({
                          ...dadosUsuario,
                          nome: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p>{dadosUsuario.nome}</p>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <span>E-mail</span>
                  {editando ? (
                    <input
                      type="email"
                      value={dadosUsuario?.email || ""}
                      onChange={(e) =>
                        setDadosUsuario({
                          ...dadosUsuario,
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p>{dadosUsuario?.email || "Não informado"}</p>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <span>Senha</span>

                  {/* DADOS NORMAL */}
                  {!editando && (
                    <div className={styles.senhaContainer}>
                      <p>{mostrarSenha ? dadosUsuario?.senha : "••••••••"}</p>

                      <button
                        type="button"
                        className={styles.botaoOlho}
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                      >
                        {mostrarSenha ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  )}

                  {/* GATILHO */}
                  {editando && !alterarSenha && (
                    <button
                      type="button"
                      className={styles.botaoAlterarSenha}
                      onClick={() => setAlterarSenha(true)}
                    >
                      <KeyRound size={15} />
                      Alterar senha
                    </button>
                  )}

                  {/* FORMULÁRIO DE NOVA SENHA */}
                  {alterarSenha && (
                    <div className={styles.areaSenha}>
                      <div className={styles.campoSenha}>
                        <input
                          type={mostrarNovaSenha ? "text" : "password"}
                          placeholder="Nova senha"
                          value={novaSenha}
                          onChange={(e) => setNovaSenha(e.target.value)}
                        />
                        <button
                          type="button"
                          className={styles.botaoOlhoInput}
                          onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                        >
                          {mostrarNovaSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      <div className={styles.campoSenha}>
                        <input
                          type={mostrarConfirmarSenha ? "text" : "password"}
                          placeholder="Confirmar nova senha"
                          value={confirmarSenha}
                          onChange={(e) => setConfirmarSenha(e.target.value)}
                        />
                        <button
                          type="button"
                          className={styles.botaoOlhoInput}
                          onClick={() =>
                            setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                          }
                        >
                          {mostrarConfirmarSenha ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>

                      {erroSenha && (
                        <p className={styles.erroSenha}>{erroSenha}</p>
                      )}

                      <div className={styles.acoesSenha}>
                        <button
                          type="button"
                          className={styles.cancelarSenha}
                          onClick={() => {
                            setAlterarSenha(false);
                            setNovaSenha("");
                            setConfirmarSenha("");
                            setErroSenha("");
                          }}
                        >
                          Cancelar
                        </button>

                        <button
                          type="button"
                          className={styles.salvarSenha}
                          onClick={() => {
                            if (!novaSenha || !confirmarSenha) {
                              setErroSenha("Preencha os dois campos.");
                              return;
                            }

                            if (novaSenha !== confirmarSenha) {
                              setErroSenha("As senhas não coincidem.");
                              return;
                            }

                            setErroSenha("");

                            setDadosUsuario({
                              ...dadosUsuario,
                              senha: novaSenha,
                            });

                            setNovaSenha("");
                            setConfirmarSenha("");
                            setAlterarSenha(false);
                          }}
                        >
                          Salvar nova senha
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* BOTÕES */}
              <div className={styles.acoesSidebar}>
                {editando ? (
                  <button
                    className={styles.salvarAlteracoes}
                    onClick={salvarAlteracoes}
                  >
                    Salvar alterações
                  </button>
                ) : (
                  <button
                    className={styles.sairConta}
                    onClick={() => setConfirmarSaida(true)}
                  >
                    Sair da conta
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {confirmarSaida && (
          <div className={styles.overlayConfirmarSaida}>
            <LogoutConfirm
              onConfirm={sairDaConta}
              onCancel={() => setConfirmarSaida(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}