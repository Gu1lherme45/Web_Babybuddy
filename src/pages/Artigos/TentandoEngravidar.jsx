import styles from "./TentandoEngravidar.module.css";
import imagem from "../../assets/art2.svg";

export default function TentandoEngravidar() {
  return (
    <div className={styles.container}>

      {/* NOVO HEADER (SUBSTITUI O HERO) */}
      <div className={styles.articleHeader}>

        <span className={styles.breadcrumb}>
          Artigos &gt; Tentando engravidar
        </span>

        <h1>
          Tentando Engravidar? Guia completo: Dicas, Fatores e Cuidados
        </h1>

        <p className={styles.subtitle}>
          Entenda como funciona o seu corpo, descubra o período fértil e veja
          hábitos que podem aumentar suas chances de engravidar.
        </p>

        <div className={styles.meta}>
          ⏱️ 8 min de leitura
        </div>

        <div className={styles.heroImage}>
          <img src={imagem} alt="Tentando engravidar" />
        </div>

      </div>

      {/* TEXTO INTRO (veio do seu hero antigo) */}
      <section className={styles.section}>
        <p>
          Quando você decide tentar engravidar, a jornada pode ser
          emocionante, mas também desafiadora e cheia de dúvidas.
          Engravidar nem sempre acontece de imediato, mesmo em casais
          saudáveis — e isso é normal. Entender como funciona o corpo,
          o momento fértil e hábitos que podem ajudar aumenta suas
          chances e te prepara melhor para essa fase.
        </p>
      </section>

      {/* FERTILIDADE */}
      <section className={styles.section}>
        <h2>Entendendo a Fertilidade</h2>

        <p>
          A concepção ocorre quando um óvulo é fertilizado por um espermatozoide,
          geralmente no momento da ovulação, que acontece uma vez por ciclo menstrual.
          O período fértil costuma incluir os 3 a 5 dias antes da ovulação e o
          próprio dia da ovulação — esse é o momento com mais chances de gravidez.
        </p>

        <p>
          Mesmo em casais jovens e férteis, as chances de engravidar em um único
          ciclo giram em torno de 20% a 25%. Após vários meses de tentativas,
          a probabilidade de sucesso aumenta gradualmente.
        </p>
      </section>

      {/* DICAS */}
      <section className={styles.section}>

        <h2>1. Identifique o Período Fértil</h2>
        <p>
          Saber quando você está ovulando é muito importante para otimizar as
          chances. Isso pode ser feito com:
        </p>

        <ul>
          <li>Aplicativos de acompanhamento menstrual e de ovulação</li>
          <li>Testes de ovulação (urina)</li>
          <li>Monitoramento do muco cervical e da temperatura basal</li>
        </ul>

        <p>
          Esses métodos ajudam a prever o momento ideal para ter relações
          quando as chances são maiores.
        </p>

        {/* DICA (agora só ela tem lateral rosa) */}
        <div className={styles.dica}>
          💡 Manter relações nos dias ao redor da ovulação aumenta a
          probabilidade de concepção.
        </div>
      </section>

      {/* HÁBITOS */}
      <section className={styles.section}>
        <h2>2. Adote Hábitos Saudáveis no Dia a Dia</h2>

        <p>
          Ter um estilo de vida equilibrado impacta diretamente sua fertilidade,
          tanto feminina quanto masculina.
        </p>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Atividade física</h3>
            <p>
              Exercícios moderados ajudam no equilíbrio hormonal e na circulação,
              favorecendo a ovulação e a saúde reprodutiva.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Alimentação equilibrada</h3>
            <p>
              Uma dieta rica em frutas, vegetais e nutrientes contribui para a fertilidade.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Suplementos</h3>
            <p>
              O uso de ácido fólico é recomendado antes da gravidez.
            </p>
          </div>
        </div>
      </section>

     {/* EVITAR */}
      <section className={styles.section}>
        <h2>3. Evite Substâncias que Prejudicam a Fertilidade</h2>

        <div className={styles.cards}>
          <div>
            <h3>Tabaco</h3>
            <p>
              Fumar diminui significativamente a fertilidade e aumenta riscos
              de complicações.
            </p>
          </div>

          <div>
            <h3>Álcool</h3>
            <p>
              Mesmo em pequenas quantidades, pode dificultar a concepção.
              O ideal é evitar durante as tentativas.
            </p>
          </div>

          <div>
            <h3>Cafeína</h3>
            <p>
              Limitar o consumo a menos de 200–300 mg por dia ajuda a evitar
              impactos negativos na fertilidade.
            </p>
          </div>
        </div>
      </section>

      {/* ESTRESSE */}
      <section className={styles.section}>
        <h2>4. Gerencie o Estresse</h2>

        <p>
          O estresse pode afetar os hormônios ligados à ovulação. Praticar
          atividades como exercícios, meditação e momentos de lazer ajuda a
          tornar o processo mais leve e saudável.
        </p>
      </section>

      {/* MÉDICO */}
      <section className={styles.section}>
        <h2>5. Consulte um Profissional de Saúde</h2>

        <p>
          Antes e durante as tentativas, conversar com um médico pode ajudar em:
        </p>

        <ul>
          <li>Exames hormonais</li>
          <li>Saúde reprodutiva geral</li>
          <li>Suplementação adequada</li>
          <li>Condições médicas pré-existentes</li>
        </ul>

        <p>
          Se após 12 meses de tentativas (ou 6 meses para mulheres acima de 35 anos)
          não houver sucesso, é recomendado buscar avaliação especializada.
        </p>
      </section>

      {/* PRÉ-CONCEPÇÃO */}
      <section className={styles.section}>
        <h2>Preparação Pré-Concepção</h2>

        <ul>
          <li>Fazer check-up médico</li>
          <li>Verificar vacinas</li>
          <li>Ajustar alimentação e vitaminas</li>
          <li>Manter peso saudável</li>
        </ul>

        <p>
          Essas medidas ajudam a preparar o corpo para uma gestação saudável.
        </p>
      </section>

      {/* PARCEIRO */}
      <section className={styles.section}>
        <h2>Envolva seu parceiro</h2>

        <p>
          A fertilidade masculina também é importante. Hábitos como:
        </p>

        <ul>
          <li>Alimentação saudável</li>
          <li>Redução de álcool e tabaco</li>
          <li>Evitar calor excessivo na região íntima</li>
        </ul>

        <p>
          ajudam a manter a qualidade dos espermatozoides.
        </p>
      </section>

      {/* DESTAQUE FINAL */}
      <div className={styles.highlight}>
        Seja paciente e resiliente. A gravidez pode levar tempo — algumas
        pessoas conseguem rapidamente, enquanto outras precisam de mais
        tentativas. O importante é manter hábitos saudáveis e cuidar do
        bem-estar físico e emocional durante toda a jornada.
      </div>

    </div>
  );
}