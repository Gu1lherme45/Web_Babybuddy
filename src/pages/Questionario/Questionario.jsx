import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Questionario.module.css";

import logo from "../../assets/logoofc3.svg";
import heartQuestion from "../../assets/heartquestion.png";
import AnimatedButton from "../../components/AnimatedButton";
import LiquidRadioGroup from "../../components/LiquidRadioGroup";

const FAIXAS_IDADE = ["15-25", "26-35", "36-44", "44+"];

// formato YYYY-MM-DD (exigido pelo input date) respeitando o fuso local
const hoje = new Date().toLocaleDateString("sv-SE");

const TIPOS_SANGUINEOS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
];

const CONDICOES_SAUDE = [
  "Não",
  "Hipertensão",
  "Diabetes gestacional",
  "Anemia",
  "Outra",
];

const ESTADO_INICIAL = {
  idade: "15-25",
  tipoSanguineo: "",
  jaTeveParto: "",
  primeiraGestacao: "",
  semanaGestacao: "",
  dpp: "",
  possuiProblemaSaude: "",
  condicaoSaude: "",
  outraCondicao: "",
  acompanhamentoPreNatal: "",
  possuiAlergia: "",
  alergia: "",
  cicloRegular: "",
  autorizaUsoDados: "",
  aceitouTermos: false,
};

const ETAPAS = [
  {
    campo: "idade",
    pergunta: "Qual é a sua idade?",
    tipo: "radio",
    opcoes: FAIXAS_IDADE,
  },
  {
    campo: "tipoSanguineo",
    pergunta: "Qual o seu tipo sanguíneo?",
    tipo: "select",
    opcoes: TIPOS_SANGUINEOS,
  },
  {
    campo: "jaTeveParto",
    pergunta: "Você já teve algum parto?",
    tipo: "buttons",
    opcoes: ["Sim", "Não"],
  },
  {
    campo: "primeiraGestacao",
    pergunta: "Esta é sua primeira gestação?",
    tipo: "buttons",
    opcoes: ["Sim", "Não"],
  },
  {
    campo: "semanaGestacao",
    pergunta: "Você está em qual semana de gestação?",
    tipo: "select",
    opcoes: Array.from({ length: 42 }, (_, i) => String(i + 1)),
  },
  {
    campo: "dpp",
    pergunta: "Qual é a data prevista para o parto?",
    tipo: "date",
  },
  {
    campo: "possuiProblemaSaude",
    pergunta: "Possui algum problema de saúde?",
    tipo: "buttons",
    opcoes: ["Sim", "Não"],
  },
  {
    campo: "condicaoSaude",
    pergunta:
      "Você possui alguma condição de saúde que requer acompanhamento durante a gestação?",
    tipo: "select",
    opcoes: CONDICOES_SAUDE,
    condicional: {
      valorGatilho: "Outra",
      campoExtra: "outraCondicao",
      labelExtra: "Qual condição de saúde?",
    },
  },
  {
    campo: "acompanhamentoPreNatal",
    pergunta: "Você realiza acompanhamento pré-natal regularmente?",
    tipo: "buttons",
    opcoes: ["Sim", "Ainda não iniciei", "Não"],
  },
  {
    campo: "possuiAlergia",
    pergunta: "Você possui alguma alergia a medicamentos ou alimentos?",
    tipo: "buttons",
    opcoes: ["Não", "Sim"],
    condicional: {
      valorGatilho: "Sim",
      campoExtra: "alergia",
      labelExtra: "Qual alergia?",
    },
  },
  {
    campo: "cicloRegular",
    pergunta: "Seu ciclo menstrual costuma ser regular?",
    tipo: "buttons",
    opcoes: ["Sim", "Não"],
  },
  {
    campo: "autorizaUsoDados",
    pergunta:
      "Você autoriza o uso dessas informações para personalização de conteúdos?",
    tipo: "buttons",
    opcoes: ["Sim", "Não"],
    linkTermos: true,
  },
  {
    campo: "aceitouTermos",
    pergunta: "Termos de Uso e Política de Privacidade",
    tipo: "checkbox",
  },
];

export default function Questionario() {
  const [step, setStep] = useState(0);
  const [dados, setDados] = useState(ESTADO_INICIAL);
  const [errors, setErrors] = useState({});
  const [enviando, setEnviando] = useState(false);

  const navigate = useNavigate();

  const etapaAtual = ETAPAS[step - 1];
  const progress = (step / ETAPAS.length) * 100;
  const fase =
    step === 0 ? "inicio" : step <= ETAPAS.length ? "perguntas" : "final";

  function handleChange(campo, valor) {
    setDados((prev) => ({ ...prev, [campo]: valor }));
    setErrors((prev) => ({ ...prev, [campo]: undefined }));
  }

  function validarEtapa() {
    const novosErros = {};
    const { campo, tipo, condicional } = etapaAtual;
    const valor = dados[campo];

    if (tipo === "select" || tipo === "buttons" || tipo === "radio") {
      if (!valor) {
        novosErros[campo] = "Selecione uma opção.";
      }
    }

    if (tipo === "date") {
      if (!valor) {
        novosErros[campo] = "Selecione uma data válida.";
      } else if (valor < hoje) {
        novosErros[campo] = "A data não pode ser anterior a hoje.";
      }
    }

    if (tipo === "checkbox") {
      if (!valor) {
        novosErros[campo] =
          "É necessário aceitar os Termos de Uso e a Política de Privacidade.";
      }
    }

    if (
      condicional &&
      valor === condicional.valorGatilho &&
      !dados[condicional.campoExtra]
    ) {
      novosErros[condicional.campoExtra] = "Este campo é obrigatório.";
    }

    setErrors(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  async function salvarQuestionario() {
    // TODO: plugar aqui a integração real com o backend (ex: seu serviço
    // de axios ou fetch), quando estiver pronta. Por enquanto só loga os dados.
    console.log("Dados do questionário prontos para envio:", dados);
    return Promise.resolve();
  }

  async function nextStep() {
    if (!validarEtapa()) return;

    if (step < ETAPAS.length) {
      setStep((prev) => prev + 1);
      return;
    }

    // última etapa (termos) -> envia o cadastro
    try {
      setEnviando(true);
      await salvarQuestionario();
      setStep((prev) => prev + 1);
    } catch (error) {
      console.error("Erro ao salvar questionário:", error);
      setErrors((prev) => ({
        ...prev,
        aceitouTermos:
          "Não foi possível enviar seus dados. Tente novamente.",
      }));
    } finally {
      setEnviando(false);
    }
  }

  function prevStep() {
    setStep((prev) => Math.max(prev - 1, 0));
  }

  function renderCampo() {
    const { campo, tipo, opcoes, condicional, linkTermos } = etapaAtual;

    if (tipo === "radio") {
      return (
        <div className={styles.fieldGroup}>
          <LiquidRadioGroup
            name={campo}
            options={opcoes}
            value={dados[campo]}
            onChange={(valor) => handleChange(campo, valor)}
          />

          {errors[campo] && (
            <p className={styles.errorText}>{errors[campo]}</p>
          )}
        </div>
      );
    }

    if (tipo === "date") {
      return (
        <div className={styles.fieldGroup}>
          <input
            type="date"
            lang="pt-BR"
            min={hoje}
            className={`${styles.input} ${
              errors[campo] ? styles.inputError : ""
            }`}
            value={dados[campo]}
            onChange={(e) => handleChange(campo, e.target.value)}
          />

          {errors[campo] && (
            <p className={styles.errorText}>{errors[campo]}</p>
          )}
        </div>
      );
    }

    if (tipo === "select") {
      return (
        <div className={styles.fieldGroup}>
          <select
            className={`${styles.select} ${
              campo === "tipoSanguineo" ? styles.selectTipoSanguineo : ""
            } ${errors[campo] ? styles.inputError : ""}`}
            value={dados[campo]}
            onChange={(e) => handleChange(campo, e.target.value)}
          >
            <option value="" className={styles.selectPlaceholder}>
              Selecionar
            </option>

            {opcoes.map((opt, index) => (
              <option key={index} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          {errors[campo] && (
            <p className={styles.errorText}>{errors[campo]}</p>
          )}

          {condicional && dados[campo] === condicional.valorGatilho && (
            <div className={styles.extraField}>
              <label>{condicional.labelExtra}</label>

              <input
                type="text"
                className={`${styles.input} ${
                  errors[condicional.campoExtra] ? styles.inputError : ""
                }`}
                value={dados[condicional.campoExtra]}
                onChange={(e) =>
                  handleChange(condicional.campoExtra, e.target.value)
                }
              />

              {errors[condicional.campoExtra] && (
                <p className={styles.errorText}>
                  {errors[condicional.campoExtra]}
                </p>
              )}
            </div>
          )}
        </div>
      );
    }

    if (tipo === "buttons") {
      return (
        <div className={styles.fieldGroup}>
          <div className={styles.options}>
            {opcoes.map((opt, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.option} ${
                  dados[campo] === opt ? styles.selected : ""
                }`}
                onClick={() => handleChange(campo, opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          {errors[campo] && (
            <p className={styles.errorText}>{errors[campo]}</p>
          )}

          {condicional && dados[campo] === condicional.valorGatilho && (
            <div className={styles.extraField}>
              <label>{condicional.labelExtra}</label>

              <input
                type="text"
                className={`${styles.input} ${
                  errors[condicional.campoExtra] ? styles.inputError : ""
                }`}
                value={dados[condicional.campoExtra]}
                onChange={(e) =>
                  handleChange(condicional.campoExtra, e.target.value)
                }
              />

              {errors[condicional.campoExtra] && (
                <p className={styles.errorText}>
                  {errors[condicional.campoExtra]}
                </p>
              )}
            </div>
          )}

          {linkTermos && (
            <p className={styles.terms}>
              <Link to="/termos-de-uso">Ler termos de uso</Link>
            </p>
          )}
        </div>
      );
    }

    if (tipo === "checkbox") {
      return (
        <div className={styles.fieldGroup}>
          <div className={styles.checkboxRow}>
            <input
              id="aceitouTermos"
              type="checkbox"
              className={styles.checkboxInput}
              checked={dados.aceitouTermos}
              onChange={(e) =>
                handleChange("aceitouTermos", e.target.checked)
              }
            />

            <label htmlFor="aceitouTermos" className={styles.checkboxText}>
              Declaro que li e aceito os Termos de Uso e a Política de
              Privacidade para utilizar os serviços do BabyBuddy.
            </label>
          </div>

          {errors[campo] && (
            <p className={styles.errorText}>{errors[campo]}</p>
          )}
        </div>
      );
    }

    return null;
  }

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {/* TELA INICIAL */}
        {fase === "inicio" && (
          <motion.section
            key="inicio"
            className={styles.firstSection}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 0.9, 0.25, 1] }}
          >
            <div className={styles.iconArea}>
              <img
                src={heartQuestion}
                alt="Heart"
                className={styles.heartImage}
              />
            </div>

            <h1>Sua saúde importa</h1>

            <p>
              Para oferecer a melhor experiência personalizada,
              começaremos com um rápido questionário de saúde.
            </p>

            <AnimatedButton large onClick={() => setStep(1)}>
              INICIAR QUESTIONÁRIO DE SAÚDE
            </AnimatedButton>
          </motion.section>
        )}

        {/* QUESTIONÁRIO */}
        {fase === "perguntas" && (
          <motion.div
            key="perguntas"
            className={styles.questionario}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 0.9, 0.25, 1] }}
          >
            <div className={styles.top}>
              <span className={styles.back} onClick={prevStep}>
                ‹
              </span>

              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <img src={logo} alt="BabyBuddy" className={styles.logo} />

            <h2>{etapaAtual.pergunta}</h2>

            {renderCampo()}

            <button
              className={styles.button}
              onClick={nextStep}
              disabled={enviando}
            >
              {step === ETAPAS.length
                ? enviando
                  ? "Enviando..."
                  : "Finalizar questionario"
                : "Continuar"}
            </button>
          </motion.div>
        )}

        {/* FINAL */}
        {fase === "final" && (
          <motion.div
            key="final"
            className={styles.finishContainer}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 0.9, 0.25, 1] }}
          >
            <div className={styles.finishIllustration}>
              <div className={styles.circle}></div>

              <div className={styles.clipboard}>
                <div className={styles.clipHeader}></div>

                <div className={styles.clipLines}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className={styles.checkIcon}>✓</div>
            </div>

            <h1 className={styles.finishTitle}>Tudo pronto!</h1>

            <p className={styles.finishText}>
              Sua jornada com o BabyBuddy acabou de começar.
            </p>

            <button
              className={styles.finishButton}
              onClick={() => navigate("/login")}
            >
              Ir para o login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}