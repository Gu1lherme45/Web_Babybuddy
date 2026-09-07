import styles from "./Alimentação.module.css";
import imagem from "../../assets/art5.png";

export default function Alimentacao() {
  return (
    <div className={styles.page}>
    <div className={styles.container}>

      {/* HEADER */}
      <div className={styles.header}>

        <span className={styles.breadcrumb}>
          Artigos &gt; Alimentação
        </span>

        <h1>
          Alimentação do Bebê: Guia Completo do Aleitamento à Introdução Alimentar
        </h1>

        <p className={styles.subtitle}>
          Guia Completo: Entenda a Alimentação do Bebê
        </p>

        <div className={styles.meta}>
          ⏱️ 10 min de leitura
        </div>

        <div className={styles.hero}>
          <img src={imagem} alt="Alimentação do bebê" />
        </div>

      </div>

      {/* INTRO */}
      <section className={styles.section}>
        <p>
          A alimentação do bebê passa por diversas fases nos primeiros anos de vida,
          começando pelo leite materno ou fórmula e evoluindo até uma dieta variada.
          Cada etapa tem suas particularidades e é importante respeitar o tempo de
          desenvolvimento de cada criança.
        </p>
      </section>

      {/* O QUE É */}
      <section className={styles.section}>
        <h2>Por que a alimentação nos primeiros anos é tão importante?</h2>
        <p>
          É nessa fase que se formam os hábitos alimentares que a criança levará para a
          vida adulta. Uma alimentação adequada garante o crescimento saudável, o
          desenvolvimento cerebral e o fortalecimento do sistema imunológico.
        </p>
      </section>

      {/* POR QUE MUDA */}
      <section className={styles.section}>
        <h2>Por que ela muda tanto nos primeiros anos?</h2>
        <p>
          O sistema digestivo do bebê amadurece aos poucos, e cada fase exige tipos e
          texturas diferentes de alimento, respeitando o ritmo de desenvolvimento motor
          e digestivo da criança.
        </p>
      </section>

      {/* 0-6 MESES */}
      <section className={styles.section}>
        <h2>0 a 6 meses: Aleitamento exclusivo</h2>

        <h3>O que oferecer?</h3>
        <p>
          Nessa fase, recomenda-se o aleitamento materno exclusivo. Quando não é possível,
          a fórmula infantil indicada pelo pediatra é a alternativa adequada.
        </p>

        <h3>Frequência</h3>
        <ul>
          <li>Amamentar em livre demanda, sempre que o bebê pedir</li>
          <li>Evitar água, chás e outros alimentos nesse período</li>
        </ul>

        <h3>Cuidados importantes</h3>
        <p>
          Acompanhar o ganho de peso e a frequência das mamadas com o pediatra ajuda a
          garantir que o bebê está se alimentando adequadamente.
        </p>
      </section>

      {/* 6-8 MESES */}
      <section className={styles.section}>
        <h2>6 a 8 meses: Introdução alimentar</h2>

        <h3>Primeiros alimentos</h3>
        <p>
          A partir dos 6 meses, inicia-se a introdução de papinhas de frutas e legumes,
          além de cereais, sempre amassados ou em pedaços bem pequenos.
        </p>

        <h3>Como introduzir</h3>
        <ul>
          <li>Oferecer um alimento novo por vez, observando reações alérgicas</li>
          <li>Respeitar o tempo de aceitação do bebê, sem forçar</li>
          <li>Manter o leite materno ou fórmula como complemento</li>
        </ul>
      </section>

      {/* 9-11 MESES */}
      <section className={styles.section}>
        <h2>9 a 11 meses: Variedade de texturas</h2>

        <h3>Evolução da alimentação</h3>
        <p>
          O bebê já pode experimentar alimentos amassados com garfo e pequenos pedaços,
          estimulando a mastigação e a coordenação motora.
        </p>

        <h3>Alimentação com a família</h3>
        <p>
          É um bom momento para incluir o bebê nas refeições em família, sempre com
          adaptações de tamanho e tempero.
        </p>
      </section>

      {/* 12-24 MESES */}
      <section className={styles.section}>
        <h2>12 a 24 meses: Alimentação da família</h2>

        <h3>Transição completa</h3>
        <p>
          A partir de 1 ano, a criança pode consumir praticamente os mesmos alimentos da
          família, com pouco sal e açúcar, evitando alimentos ultraprocessados.
        </p>

        <h3>Autonomia à mesa</h3>
        <p>
          Estimular a criança a comer sozinha, mesmo com alguma bagunça, ajuda no
          desenvolvimento da coordenação e da independência.
        </p>
      </section>

      {/* ALIMENTOS A EVITAR */}
      <section className={styles.section}>
        <h2>Alimentos que devem ser evitados</h2>
        <ul>
          <li>Mel antes de 1 ano (risco de botulismo infantil)</li>
          <li>Açúcar e sal em excesso</li>
          <li>Alimentos ultraprocessados e industrializados</li>
          <li>Alimentos que ofereçam risco de engasgo, como uvas inteiras e amendoim</li>
        </ul>
      </section>

      {/* ALERTA */}
      <div className={styles.warning}>
        Nunca ofereça mel, alimentos inteiros e duros (como uvas ou amendoim) ou bebidas
        adoçadas a bebês com menos de 1 ano sem orientação do pediatra.
      </div>

      {/* SINAIS DE ALERGIA */}
      <section className={styles.section}>
        <h2>Sinais de alergia alimentar</h2>
        <ul>
          <li>Vermelhidão ou manchas na pele</li>
          <li>Inchaço nos lábios, olhos ou rosto</li>
          <li>Vômitos ou diarreia após a introdução de um novo alimento</li>
          <li>Dificuldade para respirar</li>
        </ul>
      </section>

      {/* QUANDO PROCURAR AJUDA */}
      <section className={styles.section}>
        <h2>Quando procurar atendimento de emergência</h2>
        <ul>
          <li>Dificuldade para respirar após comer</li>
          <li>Inchaço rápido no rosto ou na garganta</li>
          <li>Engasgo com obstrução das vias aéreas</li>
          <li>Recusa alimentar persistente com perda de peso</li>
        </ul>
      </section>

    </div>
    </div>
  );
}
