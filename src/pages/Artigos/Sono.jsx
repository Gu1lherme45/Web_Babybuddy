import styles from "./Sono.module.css";
import imagem from "../../assets/art6.png";

export default function Sono() {
  return (
    <div className={styles.container}>

      {/* HEADER */}
      <div className={styles.header}>

        <span className={styles.breadcrumb}>
          Artigos &gt; Sono
        </span>

        <h1>
          Sono do Bebê: Guia Completo com Rotina, Fases e Dicas para Dormir a Noite Toda
        </h1>

        <p className={styles.subtitle}>
          Guia Completo: Entenda o Sono do Bebê
        </p>

        <div className={styles.meta}>
          ⏱️ 9 min de leitura
        </div>

        <div className={styles.hero}>
          <img src={imagem} alt="Sono do bebê" />
        </div>

      </div>

      {/* INTRO */}
      <section className={styles.section}>
        <p>
          O sono é essencial para o crescimento, o desenvolvimento cerebral e o bem-estar
          do bebê. Nos primeiros anos de vida, o padrão de sono muda bastante, e entender
          essas fases ajuda os pais a criar uma rotina mais tranquila para toda a família.
        </p>
      </section>

      {/* O QUE É */}
      <section className={styles.section}>
        <h2>Por que o sono do bebê é tão importante?</h2>
        <p>
          É durante o sono que o cérebro do bebê processa tudo o que aprendeu no dia e
          libera hormônios essenciais para o crescimento. Um sono de qualidade também
          fortalece o sistema imunológico e melhora o humor e a atenção do bebê.
        </p>
      </section>

      {/* FASES */}
      <section className={styles.section}>
        <h2>Como o sono do bebê muda com a idade?</h2>
        <p>
          Diferente dos adultos, os bebês passam por ciclos de sono mais curtos e alternam
          entre sono ativo (mais leve) e sono profundo. Por isso, é normal que despertem
          várias vezes durante a noite nos primeiros meses.
        </p>
      </section>

      {/* 0-3 MESES */}
      <section className={styles.section}>
        <h2>0 a 3 meses</h2>

        <h3>O que esperar?</h3>
        <p>
          O bebê ainda não tem um relógio biológico definido e dorme entre 14 e 17 horas
          por dia, distribuídas em vários períodos curtos, sem diferenciar dia e noite.
        </p>

        <h3>Rotina recomendada</h3>
        <ul>
          <li>Deixar o ambiente claro durante o dia e escuro à noite</li>
          <li>Amamentar ou alimentar sempre que o bebê demonstrar fome</li>
          <li>Evitar estímulos excessivos antes de dormir</li>
        </ul>

        <h3>Dicas para os pais</h3>
        <p>
          Aproveite para descansar sempre que o bebê estiver dormindo, mesmo durante o dia.
        </p>
      </section>

      {/* 4-6 MESES */}
      <section className={styles.section}>
        <h2>4 a 6 meses</h2>

        <h3>Desenvolvimento</h3>
        <p>
          Muitos bebês começam a dormir períodos mais longos à noite e as sonecas diurnas
          ficam mais organizadas, geralmente entre 2 e 3 por dia.
        </p>

        <h3>Rotina de sono</h3>
        <p>
          Criar uma sequência fixa antes de dormir (banho, mamada, história) ajuda o bebê
          a entender que a hora de dormir está chegando.
        </p>
      </section>

      {/* 6-12 MESES */}
      <section className={styles.section}>
        <h2>6 a 12 meses</h2>

        <h3>Consolidação do sono</h3>
        <p>
          Nessa fase, muitos bebês conseguem dormir de 10 a 12 horas seguidas à noite,
          com uma ou duas sonecas durante o dia.
        </p>

        <h3>Regressão do sono</h3>
        <p>
          É comum que o sono piore temporariamente por causa de marcos do desenvolvimento,
          como sentar, engatinhar ou o nascimento dos primeiros dentes.
        </p>
      </section>

      {/* 1-2 ANOS */}
      <section className={styles.section}>
        <h2>1 a 2 anos</h2>

        <h3>Rotina mais previsível</h3>
        <p>
          A criança passa a dormir cerca de 11 a 14 horas por dia, geralmente com apenas
          uma soneca à tarde.
        </p>

        <h3>Ansiedade de separação</h3>
        <p>
          Pode surgir resistência na hora de dormir por medo de ficar longe dos pais.
          Manter a rotina com calma e consistência ajuda a criança a se sentir segura.
        </p>
      </section>

      {/* ROTINA SAUDÁVEL */}
      <section className={styles.section}>
        <h2>Como criar uma rotina de sono saudável</h2>
        <ul>
          <li>Manter horários regulares para dormir e acordar</li>
          <li>Criar um ritual relaxante antes de deitar</li>
          <li>Evitar telas pelo menos uma hora antes de dormir</li>
          <li>Deixar o quarto escuro, silencioso e em temperatura agradável</li>
        </ul>
      </section>

      {/* ERROS COMUNS */}
      <section className={styles.section}>
        <h2>Erros comuns na hora de dormir</h2>
        <ul>
          <li>Deixar o bebê dormir sempre no colo ou balançando</li>
          <li>Trocar os horários de sono com frequência</li>
          <li>Estimular demais o bebê perto da hora de dormir</li>
        </ul>
      </section>

      {/* ALERTA */}
      <div className={styles.warning}>
        Sempre coloque o bebê para dormir de barriga para cima, em um berço firme e sem
        travesseiros, almofadas ou brinquedos soltos, para reduzir o risco de morte súbita.
      </div>

      {/* REGRESSÕES */}
      <section className={styles.section}>
        <h2>Regressões de sono: o que fazer?</h2>
        <ul>
          <li>Mantenha a rotina mesmo nos dias mais difíceis</li>
          <li>Ofereça conforto sem criar novos hábitos difíceis de largar depois</li>
          <li>Lembre-se: a maioria das regressões é temporária</li>
        </ul>
      </section>

      {/* QUANDO PROCURAR AJUDA */}
      <section className={styles.section}>
        <h2>Quando procurar o pediatra</h2>
        <ul>
          <li>Ronco frequente ou pausas na respiração durante o sono</li>
          <li>Dificuldade extrema para dormir mesmo após ajustes na rotina</li>
          <li>Sonolência excessiva durante o dia</li>
          <li>Qualquer mudança brusca e persistente no padrão de sono</li>
        </ul>
      </section>

    </div>
  );
}
