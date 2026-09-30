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
        Este conteúdo foi elaborado com base em fontes confiáveis e informações de saúde, priorizando orientações seguras e relevantes para a gestação e os cuidados com o bebê.
      </p>
    </div>
  );
}
