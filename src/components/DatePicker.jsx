import { useEffect, useId, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './DatePicker.module.css';

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function pad(numero) {
  return String(numero).padStart(2, '0');
}

function paraIso(data) {
  return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}`;
}

function daIso(texto) {
  const [ano, mes, dia] = texto.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

function formatarExibicao(texto) {
  if (!texto) return '';
  const [ano, mes, dia] = texto.split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function DatePicker({ value, onChange, min, max, invalid = false, className = '', placeholder = 'dd/mm/aaaa' }) {
  const reactId = useId();
  const ref = useRef(null);
  const [aberto, setAberto] = useState(false);
  const [mesVisivel, setMesVisivel] = useState(() => {
    const base = value ? daIso(value) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => {
    if (!aberto) return undefined;
    function fechar(event) {
      if (ref.current && !ref.current.contains(event.target)) setAberto(false);
    }
    document.addEventListener('mousedown', fechar);
    return () => document.removeEventListener('mousedown', fechar);
  }, [aberto]);

  function abrir() {
    const base = value ? daIso(value) : new Date();
    setMesVisivel(new Date(base.getFullYear(), base.getMonth(), 1));
    setAberto(true);
  }

  function mudarMes(delta) {
    setMesVisivel((atual) => new Date(atual.getFullYear(), atual.getMonth() + delta, 1));
  }

  function escolher(iso) {
    onChange(iso);
    setAberto(false);
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') setAberto(false);
  }

  const ano = mesVisivel.getFullYear();
  const mes = mesVisivel.getMonth();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const deslocamento = new Date(ano, mes, 1).getDay();
  const celulas = [
    ...Array.from({ length: deslocamento }, () => null),
    ...Array.from({ length: diasNoMes }, (_, index) => index + 1),
  ];
  const tituloMes = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(mesVisivel);
  const hojeIso = paraIso(new Date());

  return (
    <div className={`${styles.picker} ${className}`} ref={ref} onKeyDown={onKeyDown}>
      <button type="button" id={reactId} className={`${styles.trigger} ${invalid ? styles.invalid : ''}`}
        aria-haspopup="dialog" aria-expanded={aberto}
        onClick={() => (aberto ? setAberto(false) : abrir())}>
        <span className={value ? undefined : styles.placeholder}>{formatarExibicao(value) || placeholder}</span>
        <CalendarDays size={18} className={styles.icon} aria-hidden="true" />
      </button>

      {aberto && (
        <div className={styles.menu} role="dialog" aria-label="Escolher data">
          <div className={styles.cabecalho}>
            <button type="button" className={styles.navegar} onClick={() => mudarMes(-1)} aria-label="Mês anterior">
              <ChevronLeft size={18} />
            </button>
            <strong className={styles.titulo}>{tituloMes.charAt(0).toUpperCase() + tituloMes.slice(1)}</strong>
            <button type="button" className={styles.navegar} onClick={() => mudarMes(1)} aria-label="Próximo mês">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={styles.grade}>
            {DIAS_SEMANA.map((dia, index) => (
              <span key={index} className={styles.diaSemana}>{dia}</span>
            ))}
            {celulas.map((dia, index) => {
              if (dia === null) return <span key={`vazio-${index}`} />;
              const iso = `${ano}-${pad(mes + 1)}-${pad(dia)}`;
              const indisponivel = (min && iso < min) || (max && iso > max);
              const selecionado = iso === value;
              const hoje = iso === hojeIso;
              return (
                <button key={iso} type="button" disabled={indisponivel}
                  className={`${styles.dia} ${selecionado ? styles.diaSelecionado : ''} ${hoje && !selecionado ? styles.diaHoje : ''}`}
                  onClick={() => escolher(iso)}>
                  {dia}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
