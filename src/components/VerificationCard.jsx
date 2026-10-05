import { ShieldCheck } from 'lucide-react';
import styles from './VerificationCard.module.css';

export default function VerificationCard() {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <ShieldCheck className={styles.icon} size={21} />
        <span>Conteúdo verificado</span>
      </div>
      <p className={styles.text}>
        As informações apresentadas nos artigos do BabyBuddy são elaboradas com base em fontes confiáveis e materiais de referência relacionados à gestação, saúde materna, cuidados com o bebê e bem-estar familiar. Nosso objetivo é oferecer conteúdos claros, responsáveis e de fácil compreensão para ajudar você a encontrar informações úteis durante cada etapa dessa jornada.
      </p>
    </div>
  );
}
