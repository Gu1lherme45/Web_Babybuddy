import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ClipboardCheck,
  HeartPulse,
  BookOpen,
  Shield,
  BadgeCheck,
  HeartHandshake,
  BookOpenText,
  ShieldCheck,
  Heart,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import styles from "./Home.module.css";
import AnimatedButton from "../../components/AnimatedButton";
import useIsMobile from "../../hooks/useIsMobile";

import Mobile from "../../assets/mobilehomeoficial.svg";
import imgGravida from "../../assets/imggravidahome3.svg";

import art1 from "../../assets/art1.png";
import art2 from "../../assets/art2.png";
import art3 from "../../assets/art3.png";
import { absoluteApiUrl } from "../../services/api";
import { listPublicMaterials } from "../../services/materialService";
import facilidade from "../../assets/facilidade.png";
import informacoes from "../../assets/informações.png";
import privacidade from "../../assets/privacidade.png";

function semAcentos(texto) {
  return (texto || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("pt-BR");
}

// Se o artigo ainda não tem imagem própria cadastrada no painel, usa o
// retrato de reserva do seu próprio card (não de um tema "adivinhado" pelo
// texto, pra nunca pegar a imagem errada entre os 3 destaques).
function imagemMaterial(material) {
  const origem = material.imagem || material.capa;
  return origem ? absoluteApiUrl(origem) : (material.imagemPadrao || art1);
}

// Os 3 artigos fixos que sempre aparecem em "Principais Artigos", nesta ordem.
// O match é pela rota (ou, na falta dela, pelo título exato) — nunca por
// categoria "parecida", pra um artigo como "Amamentação" (mesma categoria de
// "Cuidados com o Bebê") não entrar aqui por engano.
const ARTIGOS_DESTAQUE = [
  { rota: "/periodo-gestacional", titulo: "periodo gestacional", imagemPadrao: art3 },
  { rota: "/tentando-engravidar", titulo: "tentando engravidar", imagemPadrao: art2 },
  { rota: "/cuidados-bebe", titulo: "cuidados com o bebe", imagemPadrao: art1 },
];

export default function Home() {
  const location = useLocation();
  const [materiais, setMateriais] = useState([]);
  const [artigoIndex, setArtigoIndex] = useState(0);
  const [direcaoArtigo, setDirecaoArtigo] = useState(1);
  const isMobile = useIsMobile();

  const destaques = useMemo(() => ARTIGOS_DESTAQUE
    .map(({ rota, titulo, imagemPadrao }) => {
      const material = materiais.find((item) => item.link === rota)
        || materiais.find((item) => semAcentos(item.titulo) === titulo);
      return material ? { ...material, imagemPadrao } : null;
    })
    .filter(Boolean), [materiais]);

  useEffect(() => {
    listPublicMaterials().then(setMateriais).catch(() => setMateriais([]));
  }, []);

  useEffect(() => {
    setArtigoIndex(0);
  }, [destaques.length]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className={styles.home}>
      {/* HERO */}
      <section id="inicio" className={styles.hero}>
        <div className={styles.container}>
          {/* TEXTO */}
          <div className={styles.left}>
            <h1>
              Cuidado e tecnologia <br />
              em <span>cada etapa.</span>
            </h1>

            <p>
              Acompanhe sua gestação com segurança e praticidade.
              <br />
              Informações personalizadas para você e seu bebê.
            </p>

            <Link to="/cadastro">
              <AnimatedButton>{isMobile ? 'Começar agora' : 'Começar agora!'}</AnimatedButton>
            </Link>

            {/* BENEFÍCIOS */}
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.icon}>
                  <ShieldCheck size={20} />
                </div>

                <span>
                  Seguro e <br />
                  confiável
                </span>
              </div>

              <div className={styles.feature}>
                <div className={styles.icon}>
                  <BarChart3 size={20} />
                </div>

                <span>
                  Acompanhamento <br />
                  inteligente
                </span>
              </div>

              <div className={styles.feature}>
                <div className={styles.icon}>
                  <Heart size={20} />
                </div>

                <span>
                  Feito para você <br />e seu bebê
                </span>
              </div>
            </div>
          </div>

          {/* IMAGEM */}
          <div className={styles.right}>
            <img src={imgGravida} alt="Gestante" className={styles.image} />
          </div>
        </div>
      </section>

      <section className={styles.sectionBaby}>
        <div className={styles.sectionBabyContainer}>
          <div className={styles.sectionBabyLeft}>
            <img
              src={Mobile}
              alt="Imagem do app"
              className={styles.sectionBabyImage}
            />
          </div>

          <div className={styles.sectionBabyRight}>
            <h2 className={styles.sectionBabyTitle}>
              {isMobile ? (
                <>
                  O que posso fazer com o
                  <br />
                  aplicativo BabyBuddy?
                </>
              ) : (
                'O que posso fazer com o aplicativo BabyBuddy?'
              )}
            </h2>

            <p className={styles.sectionBabyText}>
              Organize consultas, acompanhe o desenvolvimento do bebê e tenha
              acesso a informações confiáveis em um único lugar.
            </p>

            <div className={styles.sectionBabyItem}>
              <div className={styles.sectionBabyIcon}>
                <CalendarDays size={20} />
              </div>
              <div>
                <h3>Acompanhamento semanal</h3>
                <p>Acompanhe o desenvolvimento do seu bebê.</p>
              </div>
            </div>

            <div className={styles.sectionBabyItem}>
              <div className={styles.sectionBabyIcon}>
                <ClipboardCheck size={20} />
              </div>
              <div>
                <h3>Consultas e exames</h3>
                <p>Organize compromissos importantes e receba lembretes.</p>
              </div>
            </div>

            <div className={styles.sectionBabyItem}>
              <div className={styles.sectionBabyIcon}>
                <HeartPulse size={20} />
              </div>
              <div>
                <h3>Saúde da gestante</h3>
                <p>Registre sintomas, peso e informações importantes.</p>
              </div>
            </div>

            <div className={styles.sectionBabyItem}>
              <div className={styles.sectionBabyIcon}>
                <BookOpen size={20} />
              </div>
              <div>
                <h3>Conteúdo confiável</h3>
                <p>
                  Artigos e orientações desenvolvidos para cada etapa da
                  gravidez.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BENEFÍCIOS */}
        <div className={styles.benefitsContainer}>
          <div className={styles.benefitCard}>
            <div className={styles.iconCircle}>
              <Shield size={28} />
            </div>

            <div>
              <h3>Seguro e privado</h3>
              <p>Seus dados protegidos com carinho.</p>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.benefitCard}>
            <div className={styles.iconCircle}>
              <BookOpen size={28} />
            </div>

            <div>
              <h3>Conteúdo Verificado</h3>
              <p>Informações confiáveis para sua tranquilidade.</p>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.benefitCard}>
            <div className={styles.iconCircle}>
              <BadgeCheck size={28} />
            </div>

            <div>
              <h3>Feito para você</h3>
              <p>Porque cada gestação é única e especial.</p>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.benefitCard}>
            <div className={styles.iconCircle}>
              <Heart size={28} />
            </div>

            <div>
              <h3>Mais que um app</h3>
              <p>Um parceiro na sua jornada gestacional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section id="featureshome" className={styles.sectionFeatures}>
        <div className={styles.containerFeatures}>
          <div className={styles.featureItem}>
            <img src={facilidade} alt="Facilidade" />
            <h3>Facilidade</h3>
            <p>
              O BabyBuddy traz praticidade ao reunir todas as informações e
              atualizações da gravidez em um só lugar, tornando o
              acompanhamento simples e a jornada mais tranquila.
            </p>
          </div>

          <div className={styles.featureItem}>
            <img src={informacoes} alt="Informações confiáveis" />
            <h3>Informações confiáveis</h3>
            <p>
              Receba conteúdos pensados para cada momento da gestação, com
              orientações que ajudam a tirar dúvidas e trazer mais segurança
              durante toda a jornada.
            </p>
          </div>

          <div className={styles.featureItem}>
            <img src={privacidade} alt="Privacidade" />
            <h3>Privacidade</h3>
            <p>
              Com o BabyBuddy, você tem controle total. Suas informações
              pessoais ficam seguras e seus dados de saúde nunca serão
              compartilhados fora do aplicativo.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section id="artigoshome" className={styles.sectionArtigos}>
        <svg
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          className={styles.waveTopArtigos}
        >
          <path
            d={isMobile
              ? "M0,0C480,110,960,110,1440,0L1440,0L0,0Z"
              : "M0,0C120,60,240,100,360,90C480,80,600,40,720,40C840,40,960,80,1080,90C1200,100,1320,60,1440,0L1440,0L0,0Z"}
            fill="#FFD8DC"
          />
        </svg>

        <div className={styles.artigosContainer}>
          <h2 className={styles.artigosTitle}>Principais Artigos</h2>

          {isMobile ? (
            destaques.length > 0 && (
              <div className={styles.artigoCarrossel}>
                <button
                  type="button"
                  className={styles.setaArtigo}
                  onClick={() => { setDirecaoArtigo(-1); setArtigoIndex((i) => i - 1); }}
                  disabled={artigoIndex <= 0}
                  aria-label="Artigo anterior"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className={styles.artigoCarrosselTrack}>
                  <AnimatePresence mode="wait" initial={false} custom={direcaoArtigo}>
                    <motion.div
                      key={destaques[artigoIndex].id}
                      custom={direcaoArtigo}
                      initial={{ opacity: 0, x: direcaoArtigo * 28 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -direcaoArtigo * 28 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                      <ArtigoCard material={destaques[artigoIndex]} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  className={styles.setaArtigo}
                  onClick={() => { setDirecaoArtigo(1); setArtigoIndex((i) => i + 1); }}
                  disabled={artigoIndex >= destaques.length - 1}
                  aria-label="Próximo artigo"
                >
                  <ChevronRight size={16} />
                </button>

                <div className={styles.artigoDots}>
                  {destaques.map((material, i) => (
                    <span key={material.id} className={i === artigoIndex ? styles.dotAtivo : styles.dot} />
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className={styles.artigosGrid}>
              {destaques.map((material) => <ArtigoCard key={material.id} material={material} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ArtigoCard({ material }) {
  return (
    <Link
      to={material.arquivo ? `/artigos/${material.id}` : material.link || `/artigos/${material.id}`}
      className={styles.artigoCard}
      onClick={() => window.scrollTo(0, 0)}
    >
      <img src={imagemMaterial(material)} alt={`Imagem de ${material.titulo}`} />
      <h3>{material.titulo.toUpperCase()}</h3>
      <p>{material.descricao}</p>
    </Link>
  );
}
