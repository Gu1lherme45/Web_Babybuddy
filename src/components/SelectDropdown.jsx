import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './SelectDropdown.module.css';

export default function SelectDropdown({ id, value, opcoes, onChange, placeholder = 'Selecione...', invalid = false, className = '' }) {
  const reactId = useId();
  const triggerId = id || reactId;
  const [aberto, setAberto] = useState(false);
  const [destaque, setDestaque] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!aberto) return undefined;
    function fechar(event) {
      if (ref.current && !ref.current.contains(event.target)) setAberto(false);
    }
    document.addEventListener('mousedown', fechar);
    return () => document.removeEventListener('mousedown', fechar);
  }, [aberto]);

  function abrir() {
    setDestaque(Math.max(0, opcoes.indexOf(value)));
    setAberto(true);
  }

  function escolher(opcao) {
    onChange(opcao);
    setAberto(false);
  }

  function onKeyDown(event) {
    if (!aberto) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        abrir();
      }
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setDestaque((index) => Math.min(opcoes.length - 1, index + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setDestaque((index) => Math.max(0, index - 1));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (opcoes[destaque] !== undefined) escolher(opcoes[destaque]);
    } else if (event.key === 'Escape') {
      setAberto(false);
    }
  }

  return (
    <div className={`${styles.dropdown} ${className}`} ref={ref}>
      <button type="button" id={triggerId} className={`${styles.trigger} ${invalid ? styles.invalid : ''}`}
        aria-haspopup="listbox" aria-expanded={aberto}
        onClick={() => (aberto ? setAberto(false) : abrir())} onKeyDown={onKeyDown}>
        <span className={value ? undefined : styles.placeholder}>{value || placeholder}</span>
        <ChevronDown size={18} className={`${styles.chevron} ${aberto ? styles.chevronOpen : ''}`} />
      </button>
      {aberto && (
        <ul role="listbox" aria-labelledby={triggerId} className={styles.menu}>
          {opcoes.length === 0 && <li className={styles.empty}>Nenhuma opção disponível</li>}
          {opcoes.map((opcao, index) => (
            <li key={opcao} role="option" aria-selected={opcao === value}
              className={`${styles.item} ${index === destaque ? styles.itemActive : ''} ${opcao === value ? styles.itemSelected : ''}`}
              onMouseEnter={() => setDestaque(index)}
              onMouseDown={(event) => { event.preventDefault(); escolher(opcao); }}>
              {opcao}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
