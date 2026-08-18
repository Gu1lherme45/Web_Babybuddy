import styles from "./PeriodoGestacional.module.css";
import imagem from "../../assets/art3.svg";

export default function PeriodoGestacional() {
  return (
    <div className={styles.container}>

      {/* HEADER */}
      <div className={styles.header}>

        <span className={styles.breadcrumb}>
          Artigos &gt; Período Gestacional
        </span>

        <h1>
          Período Gestacional: Guia Completo com Tudo sobre Gravidez, Trimestres e Cuidados
        </h1>

        <p className={styles.subtitle}>
          Guia Completo: Entenda o Período Gestacional
        </p>

        <div className={styles.meta}>
          ⏱️ 10 min de leitura
        </div>

        <div className={styles.hero}>
          <img src={imagem} alt="Período gestacional" />
        </div>

      </div>

      {/* INTRO */}
      <section className={styles.section}>
        <p>
          A gestação é o período em que o bebê se desenvolve dentro do útero da mãe.
          Esse processo é dividido em três trimestres. Cada trimestre apresenta
          mudanças no corpo da mãe e no desenvolvimento do bebê.
        </p>
      </section>

      {/* O QUE É */}
      <section className={styles.section}>
        <h2>O que é a Gestação?</h2>
        <p>
          A gestação começa com a fecundação e termina com o nascimento do bebê.
          Durante esse período, o corpo da mulher passa por diversas mudanças
          para sustentar o crescimento do bebê.
        </p>
      </section>

      {/* TRIMESTRES */}
      <section className={styles.section}>
        <h2>Por que ela é dividida em trimestres?</h2>
        <p>
          Dividir a gestação em três partes facilita o acompanhamento médico,
          pois cada fase apresenta características específicas e diferentes cuidados.
        </p>
      </section>

      {/* 1 TRIMESTRE */}
      <section className={styles.section}>
        <h2>1º Trimestre (Semanas 1–13)</h2>

        <h3>O que acontece?</h3>
        <p>
          Nesse período, ocorre a formação dos órgãos principais do bebê.
        </p>

        <h3>Sintomas comuns</h3>
        <ul>
          <li>Náuseas e enjoos</li>
          <li>Fadiga</li>
          <li>Sensibilidade nos seios</li>
          <li>Alterações de humor</li>
        </ul>

        <h3>Cuidados importantes</h3>
        <ul>
          <li>Evitar álcool e cigarro</li>
          <li>Iniciar o pré-natal</li>
          <li>Manter alimentação saudável</li>
        </ul>

        <h3>Quando procurar atendimento?</h3>
        <p>
          Em caso de sangramentos, dores intensas ou qualquer sintoma preocupante.
        </p>
      </section>

      {/* 2 TRIMESTRE */}
      <section className={styles.section}>
        <h2>2º Trimestre (Semanas 14–26)</h2>

        <h3>Desenvolvimento</h3>
        <p>
          O bebê cresce rapidamente e os movimentos começam a ser percebidos.
        </p>

        <h3>Exames e acompanhamento</h3>
        <p>
          Exames como ultrassonografia ajudam a acompanhar o desenvolvimento do bebê.
        </p>

        <h3>Saúde da gestante</h3>
        <p>
          É importante manter uma alimentação equilibrada e praticar atividades leves.
        </p>
      </section>

      {/* 3 TRIMESTRE */}
      <section className={styles.section}>
        <h2>3º Trimestre (Semanas 27–40)</h2>

        <h3>Crescimento intenso</h3>
        <p>
          O bebê ganha peso e os órgãos amadurecem para o nascimento.
        </p>

        <h3>Conversa com o médico</h3>
        <p>
          Planejar o parto e esclarecer dúvidas é essencial nessa fase.
        </p>

        <h3>Sinais de alerta</h3>
        <p>
          Contrações frequentes, perda de líquido ou redução dos movimentos do bebê.
        </p>
      </section>

      {/* CUIDADOS GERAIS */}
      <section className={styles.section}>
        <h2>Cuidados Essenciais Durante Toda a Gestação</h2>
        <ul>
          <li>Manter pré-natal em dia</li>
          <li>Hidratação adequada</li>
          <li>Exames regulares</li>
          <li>Ultrassonografias</li>
        </ul>
      </section>

      {/* ALIMENTAÇÃO */}
      <section className={styles.section}>
        <h2>Alimentação Saudável</h2>
        <ul>
          <li>Frutas e verduras</li>
          <li>Proteínas magras</li>
          <li>Grãos integrais</li>
          <li>Evitar alimentos ultraprocessados</li>
        </ul>
      </section>

      {/* EXERCICIOS */}
      <section className={styles.section}>
        <h2>Exercícios em Segurança</h2>
        <p>
          Atividades leves ajudam na circulação e no bem-estar da gestante.
        </p>
      </section>

      {/* ALERTA */}
      <div className={styles.warning}>
        Evite substâncias nocivas como álcool, tabaco e drogas.
      </div>

      {/* COMPLICAÇÕES */}
      <section className={styles.section}>
        <h2>Complicações Possíveis</h2>
        <ul>
          <li>Diabetes gestacional</li>
          <li>Hipertensão</li>
          <li>Parto prematuro</li>
        </ul>
      </section>

      {/* EMERGÊNCIA */}
      <section className={styles.section}>
        <h2>Quando procurar atendimento de emergência</h2>
        <ul>
          <li>Sangramento vaginal intenso</li>
          <li>Dor abdominal forte</li>
          <li>Dificuldade para respirar</li>
          <li>Redução dos movimentos fetais</li>
        </ul>
      </section>

    </div>
  );
}