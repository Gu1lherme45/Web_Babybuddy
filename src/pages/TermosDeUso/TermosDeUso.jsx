import styles from './TermosDeUso.module.css';

export default function TermosDeUso() {
  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1>Termos de Uso</h1>
      </div>
  
      <div className={styles.content}>

        <p><strong>Este Site é Apenas para Fins Informativos e Não Fornece Aconselhamento Médico.</strong></p>

        <p>Ao acessar ou usar os Sites ou Serviços, você concorda com estes Termos de Utilização (TDU). Se não concordar, não utilize os Sites ou Serviços.</p>

        <h3>1. Finalidade Informativa</h3>

        <ul>
          <li>O Site e Serviços oferecem informações sobre saúde infantil, desenvolvimento e nutrição, mas não substituem aconselhamento médico profissional.</li>
          <li>Consulte sempre um pediatra ou profissional de saúde antes de tomar decisões com base no conteúdo do site.</li>
        </ul>

        <h3>2. Obrigações do Utilizador</h3>

        <p>Ao utilizar os Sites e Serviços, você concorda em:</p>

        <ul>
          <li>Utilizá-los de forma legal, ética e responsável, respeitando a legislação vigente.</li>
          <li>Não copiar, reproduzir, modificar, distribuir, transmitir ou explorar qualquer conteúdo disponibilizado sem autorização prévia e expressa.</li>
          <li>Não utilizar os Sites e Serviços para fins ilícitos, fraudulentos ou que possam prejudicar terceiros ou a própria plataforma.</li>
        </ul>

        <h3>3. Privacidade e Segurança</h3>

        <p>O uso de seus dados pessoais é regulado pela nossa Política de Privacidade, que descreve como coletamos, utilizamos e protegemos suas informações.</p>

        <ul>
          <li>Você é responsável por manter a confidencialidade de sua conta, login e senha.</li>
          <li>Recomendamos que informe imediatamente qualquer uso não autorizado ou suspeita de violação de segurança.</li>
        </ul>

        <h3>4. Direitos Autorais</h3>

        <p>Todo o conteúdo disponibilizado nos Sites e Serviços é protegido por leis de direitos autorais e propriedade intelectual.</p>

        <p>Caso você acredite que algum conteúdo tenha sido utilizado sem autorização, entre em contato com nossa equipe para análise.</p>

        <h3>5. Limitação de Responsabilidade</h3>

        <ul>
          <li>Não garantimos que os Sites e Serviços estarão disponíveis de forma contínua, ininterrupta ou livre de erros.</li>
          <li>As informações disponibilizadas têm caráter informativo e não substituem orientação médica ou profissional.</li>
          <li>Não nos responsabilizamos por quaisquer danos decorrentes do uso ou da impossibilidade de uso dos Serviços.</li>
        </ul>

        <h3>6. Alterações nos Termos</h3>

        <p>Reservamo-nos o direito de modificar ou atualizar estes Termos de Uso a qualquer momento, sem aviso prévio.</p>

        <p>O uso continuado dos Sites e Serviços após alterações será considerado como aceitação dos novos termos.</p>

        <h3>Contato com a equipe</h3>

        <p>E-mail: babybuddy159@gmail.com</p>

        <p>Se tiver dúvidas, entre em contato conosco.</p>

          <div className={styles.termosPage}></div>

      </div>
    </div>
  );
}