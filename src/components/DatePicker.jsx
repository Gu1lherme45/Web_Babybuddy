import { useEffect, useId, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import styles from './DatePicker.module.css';

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

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
  const seletoresRef = useRef(null);
  const itemSelecionadoRef = useRef(null);
  const [aberto, setAberto] = useState(false);
  const [menuSeletor, setMenuSeletor] = useState(null); // 'mes' | 'ano' | null

  // ponto de partida do calendário: a data já escolhida, ou hoje — mas
  // "hoje" só serve se estiver dentro de [min, max] (ex.: data de
  // nascimento com idade mínima tem max no passado, então abrir no mês
  // atual mostraria o calendário inteiro desabilitado)
  function dataBase() {
    if (value) return daIso(value);
    const hojeData = new Date();
    if (max && paraIso(hojeData) > max) return daIso(max);
    if (min && paraIso(hojeData) < min) return daIso(min);
    return hojeData;
  }

  const [mesVisivel, setMesVisivel] = useState(() => {
    const base = dataBase();
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

  useEffect(() => {
    if (!menuSeletor) return undefined;
    function fechar(event) {
      if (seletoresRef.current && !seletoresRef.current.contains(event.target)) setMenuSeletor(null);
    }
    document.addEventListener('mousedown', fechar);
    return () => document.removeEventListener('mousedown', fechar);
  }, [menuSeletor]);

  // a lista de anos pode ter mais de 100 opções, então ao abrir o menu
  // ela precisa pular direto pro ano selecionado em vez de começar do topo
  useEffect(() => {
    if (!menuSeletor) return;
    itemSelecionadoRef.current?.scrollIntoView({ block: 'center' });
  }, [menuSeletor]);

  function abrir() {
    const base = dataBase();
    setMesVisivel(new Date(base.getFullYear(), base.getMonth(), 1));
    setAberto(true);
  }

  function mudarMes(delta) {
    setMesVisivel((atual) => new Date(atual.getFullYear(), atual.getMonth() + delta, 1));
  }

  function escolher(iso) {
    onChange(iso);
    setAberto(false);
    setMenuSeletor(null);
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      setMenuSeletor(null);
      setAberto(false);
    }
  }

  const ano = mesVisivel.getFullYear();
  const mes = mesVisivel.getMonth();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const deslocamento = new Date(ano, mes, 1).getDay();
  const celulas = [
    ...Array.from({ length: deslocamento }, () => null),
    ...Array.from({ length: diasNoMes }, (_, index) => index + 1),
  ];
  const hojeIso = paraIso(new Date());

  // intervalo de anos selecionável: respeita min/max quando informados,
  // com uma folga generosa (100 anos) quando não há limite (ex.: data de
  // nascimento só tem max, data prevista de parto só tem min)
  const anoAtual = new Date().getFullYear();
  const anoMinimo = min ? daIso(min).getFullYear() : anoAtual - 100;
  const anoMaximo = max ? daIso(max).getFullYear() : anoAtual + 100;
  const anosDisponiveis = Array.from(
    { length: anoMaximo - anoMinimo + 1 },
    (_, index) => anoMinimo + index,
  );

  function irParaMes(novoMes) {
    setMesVisivel(new Date(ano, novoMes, 1));
  }

  function irParaAno(novoAno) {
    setMesVisivel(new Date(novoAno, mes, 1));
  }

  return (
    <div className={`${styles.picker} ${className}`} ref={ref} onKeyDown={onKeyDown}>
      <button type="button" id={reactId} className={`${styles.trigger} ${invalid ? styles.invalid : ''}`}
        aria-haspopup="dialog" aria-expanded={aberto}
        onClick={() => { if (aberto) { setAberto(false); setMenuSeletor(null); } else { abrir(); } }}>
        <span className={value ? undefined : styles.placeholder}>{formatarExibicao(value) || placeholder}</span>
        <CalendarDays size={18} className={styles.icon} aria-hidden="true" />
      </button>

      {aberto && (
        <div className={styles.menu} role="dialog" aria-label="Escolher data">
          <div className={styles.cabecalho}>
            <button type="button" className={styles.navegar} onClick={() => mudarMes(-1)} aria-label="Mês anterior">
              <ChevronLeft size={16} />
            </button>

            <div className={styles.seletores} ref={seletoresRef}>
              <div className={styles.seletorWrapper}>
                <button
                  type="button"
                  className={styles.seletorBotao}
                  aria-haspopup="listbox"
                  aria-expanded={menuSeletor === 'mes'}
                  onClick={() => setMenuSeletor((atual) => (atual === 'mes' ? null : 'mes'))}
                >
                  {MESES[mes]}
                  <ChevronDown size={13} className={styles.seletorChevron} />
                </button>
                {menuSeletor === 'mes' && (
                  <ul className={styles.seletorMenu} role="listbox" aria-label="Selecionar mês">
                    {MESES.map((nomeMes, index) => (
                      <li
                        key={nomeMes}
                        ref={index === mes ? itemSelecionadoRef : undefined}
                        role="option"
                        aria-selected={index === mes}
                        className={`${styles.seletorItem} ${index === mes ? styles.seletorItemSelecionado : ''}`}
                        onClick={() => { irParaMes(index); setMenuSeletor(null); }}
                      >
                        {nomeMes}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.seletorWrapper}>
                <button
                  type="button"
                  className={styles.seletorBotao}
                  aria-haspopup="listbox"
                  aria-expanded={menuSeletor === 'ano'}
                  onClick={() => setMenuSeletor((atual) => (atual === 'ano' ? null : 'ano'))}
                >
                  {ano}
                  <ChevronDown size={13} className={styles.seletorChevron} />
                </button>
                {menuSeletor === 'ano' && (
                  <ul className={`${styles.seletorMenu} ${styles.seletorMenuAno}`} role="listbox" aria-label="Selecionar ano">
                    {anosDisponiveis.map((anoOpcao) => (
                      <li
                        key={anoOpcao}
                        ref={anoOpcao === ano ? itemSelecionadoRef : undefined}
                        role="option"
                        aria-selected={anoOpcao === ano}
                        className={`${styles.seletorItem} ${anoOpcao === ano ? styles.seletorItemSelecionado : ''}`}
                        onClick={() => { irParaAno(anoOpcao); setMenuSeletor(null); }}
                      >
                        {anoOpcao}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button type="button" className={styles.navegar} onClick={() => mudarMes(1)} aria-label="Próximo mês">
              <ChevronRight size={16} />
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
