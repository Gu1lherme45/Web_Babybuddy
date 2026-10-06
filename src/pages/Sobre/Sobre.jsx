import styles from './sobre.module.css';

// imagens (icons)
import icon1 from '../../assets/icon1.svg';
import icon2 from '../../assets/icon2.svg';
import icon3 from '../../assets/icon3.svg';
import icon4 from '../../assets/icon4.svg';

// imagens segunda parte

export default function Sobre() {
  return (
    <div className={styles.container}>

      {/* HERO */}
      <section className={styles.hero}>
        <h1>
          Bem-vinda ao nosso espaço de cuidado,<br />
          informação e tranquilidade durante a gestação.
        </h1>
        <div className={styles.line}></div>




        <div className={styles.gridInfo}>
          <div className={styles.card}>
            <img src={icon1} alt="" />
            <p>
              Monitoramento semanal da gestação, com informações detalhadas sobre o desenvolvimento do bebê e mudanças no corpo da mãe.
            </p>
          </div>

          <div className={styles.card}>
            <img src={icon2} alt="" />
            <p>
              Registro de sintomas, emoções e medidas, permitindo acompanhar sua evolução de forma prática e organizada.
            </p>
          </div>

          <div className={styles.card}>
            <img src={icon3} alt="" />
            <p>
              Alertas personalizados, ajudando você a lembrar de consultas, exames e cuidados importantes.
            </p>
          </div>

          <div className={styles.card}>
            <img src={icon4} alt="" />
            <p>
              Conteúdos exclusivos, produzidos com base em orientações médicas e científicas, para que você se sinta segura em cada decisão.
            </p>
          </div>
        </div>
      </section>




      {/* FAIXA */}
      <section className={styles.highlight}>
        <p>
          Acreditamos que cada gestação é única. Por isso, criamos um ambiente que respeita seu tempo, suas necessidades e sua jornada, para que você se sinta acompanhada, informada e confiante do início ao fim.
        </p>
      </section>





      {/* FEATURES */}
      <section className={styles.features}>
        <div className={styles.feature}>
          <h3>Acompanhe o crescimento do seu bebê</h3>
          <p>
            Descubra o tamanho aproximado do seu bebê comparando com frutas, objetos do dia a dia ou animais fofos — uma forma simples e divertida de visualizar cada etapa da gestação.
          </p>
        </div>

        <div className={styles.feature}>
          <h3>Personalize seus artigos</h3>
          <p>
            Escolha os temas que mais te interessam — saúde, bem-estar, alimentação, exercícios e mais — e receba conteúdos personalizados, feitos especialmente para a sua fase da gestação.
          </p>
        </div>

        <div className={styles.feature}>
          <h3>Tenha lembretes inteligentes</h3>
          <p>
            Adicione lembretes e receba notificações automáticas sobre consultas, exames e datas importantes, garantindo que você nunca perca um compromisso durante sua gestação.
          </p>
        </div>
      </section>

      {/* FRASE FINAL */}
      <section className={styles.quote}>
        <p>
          “Nosso compromisso é garantir que cada gestante tenha acesso a informações seguras e atualizadas, preservando a privacidade dos seus dados e oferecendo uma navegação intuitiva, rápida e acolhedora.”
        </p>
        <span>Equipe BabyBuddy.</span>
      </section>

    </div>
  );
}