import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from './Home.module.css';

import {
  CalendarDays,
  ClipboardCheck,
  HeartPulse,
  BookOpen,
  Users,

  Shield,
  BadgeCheck,
  HeartHandshake,
  BookOpenText
} from "lucide-react";


import Mobile from "../../assets/imgmobile2.svg";



import art1 from "../../assets/art1.png";
import art2 from "../../assets/art2.png";
import art3 from "../../assets/art3.png";
import facilidade from "../../assets/facilidade.png";
import informacoes from "../../assets/informações.png";
import privacidade from "../../assets/privacidade.png";

import imgGravida from "../../assets/imggravidahome3.svg";

import {
  ShieldCheck,
  Heart, 
  BarChart3,
  ArrowRight
} from "lucide-react";

export default function Home() {

  const location = useLocation();

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
    <section
      id="inicio"
      className={styles.hero}
    >

      <div className={styles.container}>

        {/* TEXTO */}
        <div className={styles.left}>

         

        <h1>Cuidado e tecnologia <br />
          em <span>cada etapa.</span>
        </h1>

          <p>
            Acompanhe sua gestação com segurança e praticidade.<br></br>
            Informações personalizadas para você e seu bebê.
          </p>

          <Link to="/cadastro">
             <button className={styles.button}> 
              Começar agora!
          <ArrowRight size={20} />
         </button>
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
                Feito para você <br />
                e seu bebê
              </span>
            </div>

          </div>

        </div>

       {/* IMAGEM */}
<div className={styles.right}>

  <img
    src={imgGravida}
    alt="Gestante"
    className={styles.image}
  />

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
        O que posso fazer com o aplicativo BabyBuddy?
      </h2>

      <p className={styles.sectionBabyText}>
        Organize consultas, acompanhe o desenvolvimento do bebê
        e tenha acesso a informações confiáveis em um único lugar.
      </p>

      <div className={styles.sectionBabyItem}>
        <div className={styles.sectionBabyIcon}>
          <CalendarDays size={20} />
        </div>
        <div>
          <h3>Acompanhamento semanal</h3>
          <p>
            Acompanhe o desenvolvimento do seu bebê.
          </p>
        </div>
      </div>

      <div className={styles.sectionBabyItem}>
        <div className={styles.sectionBabyIcon}>
          <ClipboardCheck size={20} />
        </div>
        <div>
          <h3>Consultas e exames</h3>
          <p>
            Organize compromissos importantes e receba lembretes.
          </p>
        </div>
      </div>

      <div className={styles.sectionBabyItem}>
        <div className={styles.sectionBabyIcon}>
          <HeartPulse size={20} />
        </div>
        <div>
          <h3>Saúde da gestante</h3>
          <p>
            Registre sintomas, peso e informações importantes.
          </p>
        </div>
      </div>

      <div className={styles.sectionBabyItem}>
        <div className={styles.sectionBabyIcon}>
          <BookOpen size={20} />
        </div>
        <div>
          <h3>Conteúdo confiável</h3>
          <p>
            Artigos e orientações desenvolvidos para cada etapa da gravidez.
          </p>
        </div>
      </div>

      <div className={styles.sectionBabyItem}>
        <div className={styles.sectionBabyIcon}>
          <Users size={20} />
        </div>
        <div>
          <h3>Compartilhamento familiar</h3>
          <p>
            Permita que pessoas próximas acompanhem sua jornada.
          </p>
        </div>
      </div>

    </div>

  </div>

  {/* BENEFÍCIOS */}

  <div className={styles.benefitsContainer}>

    <div className={styles.benefitCard}>
      <div className={styles.iconCircle}><Shield size={28} /></div>

      <div>
        <h3>Seguro e privado</h3>
        <p>Seus dados protegidos com carinho.</p>
      </div>
    </div>

    <div className={styles.divider}></div>

    <div className={styles.benefitCard}>
      <div className={styles.iconCircle}><BookOpen size={28} /></div>

      <div>
        <h3>Conteúdo Verificado</h3>
        <p>Informações confiáveis para sua tranquilidade.</p>
      </div>
    </div>

    <div className={styles.divider}></div>

    <div className={styles.benefitCard}>
      <div className={styles.iconCircle}><BadgeCheck size={28} />
</div>

      <div>
        <h3>Feito para você</h3>
        <p>Porque cada gestação é única e especial.</p>
      </div>
    </div>

    <div className={styles.divider}></div>

    <div className={styles.benefitCard}>
      <div className={styles.iconCircle}><Heart size={28} /></div>

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
              atualizações da gravidez em um só lugar, tornando o acompanhamento
              simples e a jornada mais tranquila.
            </p>
          </div>

          <div className={styles.featureItem}>
            <img src={informacoes} alt="Informações confiáveis" />
            <h3>Informações confiáveis</h3>
            <p>
              Receba conteúdos pensados para cada momento da gestação, com
              orientações que ajudam a tirar dúvidas e trazer mais segurança durante
              toda a jornada.
            </p>
          </div>

          <div className={styles.featureItem}>
            <img src={privacidade} alt="Privacidade" />
            <h3>Privacidade</h3>
            <p>
              Com o BabyBuddy, você tem controle total. Suas informações pessoais
              ficam seguras e seus dados de saúde nunca serão compartilhados fora do
              aplicativo.
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
    d="M0,0C120,60,240,100,360,90C480,80,600,40,720,40C840,40,960,80,1080,90C1200,100,1320,60,1440,0L1440,0L0,0Z"
    fill="#FFD8DC"
  />
</svg>

  <div className={styles.artigosContainer}>
    
    <h2 className={styles.artigosTitle}>Principais Artigos</h2>

    <div className={styles.artigosGrid}>
  <Link 
    to="/cuidados-bebe" 
    className={styles.artigoCard}
    onClick={() => window.scrollTo(0, 0)}
  >
    <img src={art1} alt="Cuidados com o bebê" />
    <h3>CUIDADOS COM O BEBÊ</h3>
    <p>Tudo que você precisa saber para cuidar do seu bebê.</p>
  </Link>

  <Link 
    to="/tentando-engravidar" 
    className={styles.artigoCard}
    onClick={() => window.scrollTo(0, 0)}
  >
    <img src={art2} alt="Tentando engravidar" />
    <h3>TENTANDO ENGRAVIDAR?</h3>
    <p>Quanto tempo demora a fecundação após a relação sexual?</p>
  </Link>

  <Link 
    to="/periodo-gestacional" 
    className={styles.artigoCard}
    onClick={() => window.scrollTo(0, 0)}
  >
    <img src={art3} alt="Período gestacional" />
    <h3>PERÍODO GESTACIONAL</h3>
    <p>Tudo que você precisa saber sobre o período gestacional!</p>
  </Link>
</div>

  </div>
</section>

    </div>
  );
}