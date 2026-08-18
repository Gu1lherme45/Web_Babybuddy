import styles from "./CuidadosBebe.module.css";
import imagem from "../../assets/art1.svg";

export default function CuidadosBebe() {
  return (
    <div className={styles.container}>

      {/* HEADER */}
      <div className={styles.articleHeader}>

        <span className={styles.breadcrumb}>
          Artigos &gt; Cuidados com o bebê
        </span>

        <h1>
          Cuidados com o Bebê: Guia completo para os primeiros dias e meses
        </h1>

        <p className={styles.subtitle}>
          Tudo que você precisa saber para cuidar do seu bebê.
        </p>

        <div className={styles.meta}>
          ⏱️ 6 min de leitura
        </div>

        <div className={styles.heroImage}>
          <img src={imagem} alt="Cuidados com o bebê" />
        </div>

      </div>

      {/* INTRO */}
      <section className={styles.section}>
        <p>
          Cuidar de um bebê recém-nascido é uma tarefa cheia de amor,
          atenção e responsabilidade. Nas primeiras semanas e meses de vida,
          o bebê depende completamente dos cuidadores para suas necessidades
          básicas, desde alimentação até segurança e higiene. A seguir, você
          encontrará um guia prático e detalhado com tudo que é importante saber.
        </p>
      </section>

      {/* PRIMEIROS DIAS */}
      <section className={styles.section}>
        <h2>Preparação para os primeiros dias</h2>

        <h3>Contato inicial com o bebê</h3>
        <p>
          Imediatamente após o nascimento, práticas como o contato pele a pele
          são recomendadas — isso ajuda a estabilizar a temperatura do bebê,
          favorece a amamentação e fortalece o vínculo afetivo.
        </p>

        <h3>Ambiente em casa</h3>
        <p>
          Nos primeiros dias, manter a casa tranquila, limpa e com pouca circulação
          de pessoas ajuda a reduzir o risco de infecções, além de proporcionar
          um ambiente mais acolhedor para o recém-nascido.
        </p>
      </section>

      {/* ALIMENTAÇÃO */}
      <section className={styles.section}>
        <h2>Alimentação do bebê</h2>

        <p>
          Os especialistas recomendam amamentar exclusivamente no peito até os
          6 meses de idade, quando possível — o leite materno fornece todos os
          nutrientes que o bebê precisa e fortalece o sistema imunológico.
        </p>

        <div className={styles.dica}>
          💡 Observe os sinais de fome do bebê, como movimentos de sucção e levar
          as mãos à boca.
        </div>
      </section>

      {/* HIGIENE */}
      <section className={styles.section}>
        <h2>Higiene e cuidado com o corpo</h2>

        <div className={styles.cards}>

          <div className={styles.card}>
            <h3>Pele e banho</h3>
            <p>
              A pele do recém-nascido é muito sensível. Use produtos neutros e
              específicos para bebês. O banho deve ser dado em água morna e com
              movimentos suaves.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Coto umbilical</h3>
            <p>
              O coto umbilical deve cair naturalmente entre uma a duas semanas.
              Evite molhar a região e mantenha sempre limpa e seca.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Unhas e mãos</h3>
            <p>
              Mantenha as unhas do bebê curtas e limpas, pois ele pode levar
              as mãos à boca com frequência.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Orelhas</h3>
            <p>
              Limpe apenas a parte externa das orelhas. Não utilize cotonetes
              ou objetos no canal auditivo.
            </p>
          </div>

        </div>
      </section>

      {/* FRALDAS */}
      <section className={styles.section}>
        <h2>Trocando fraldas</h2>

        <p>
          Trocar fraldas regularmente é essencial para evitar assaduras e manter
          o bebê confortável. Verifique as fraldas a cada poucas horas,
          especialmente após evacuações.
        </p>
      </section>

      {/* SONO */}
      <section className={styles.section}>
        <h2>Sono e segurança ao dormir</h2>

        <p>
          O bebê dorme muitas horas por dia — geralmente entre 14 e 17 horas —
          em pequenos períodos.
        </p>

        <ul>
          <li>Coloque o bebê para dormir de barriga para cima</li>
          <li>Use um berço firme e sem objetos soltos</li>
          <li>Evite cobertores e travesseiros</li>
          <li>Prefira que o bebê durma no mesmo quarto dos pais</li>
        </ul>

        <p>
          Manter a temperatura do ambiente confortável também é essencial para
          o bem-estar e segurança do bebê.
        </p>
      </section>

      {/* DESENVOLVIMENTO */}
      <section className={styles.section}>
        <h2>Desenvolvimento e estímulos</h2>

        <p>
          Conversar, cantar e brincar com o bebê desde os primeiros dias estimula
          o desenvolvimento cognitivo e emocional.
        </p>

        <p>
          Colocar o bebê de bruços por alguns minutos (sempre supervisionado)
          ajuda a fortalecer os músculos do pescoço e do tronco.
        </p>
      </section>

      {/* PEDIATRA */}
      <section className={styles.section}>
        <h2>Visitas ao pediatra e vacinação</h2>

        <p>
          A primeira consulta com o pediatra acontece logo após o nascimento,
          e o acompanhamento regular é essencial para garantir a saúde do bebê.
        </p>

        <p>
          Seguir o calendário de vacinação é fundamental para proteger contra
          doenças graves desde os primeiros meses de vida.
        </p>
      </section>

      {/* DESTAQUE FINAL */}
      <div className={styles.highlight}>
        Cuidar de um bebê envolve atenção constante e carinho, mas também
        conhecimento de práticas seguras. Desde a alimentação até o sono e
        visitas ao pediatra, cada detalhe contribui para um desenvolvimento
        saudável e para fortalecer o vínculo entre pais e bebê.
      </div>

    </div>
  );
}