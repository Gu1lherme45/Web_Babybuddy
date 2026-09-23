import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import styles from "./Questionario.module.css";

import logo from "../../assets/logoofc3.svg";
import heartQuestion from "../../assets/heartquestion.png";
import AnimatedButton from "../../components/AnimatedButton";
import LiquidRadioGroup from "../../components/LiquidRadioGroup";
import useAuth from "../../auth/useAuth";
import {
  atualizarGestante,
  atualizarQuestionario,
  criarGestante,
  criarQuestionario,
  listarGestantes,
  listarQuestionariosPorGestante,
  ApiError,
} from "../../services/api";

// formato YYYY-MM-DD (exigido pelo input date) respeitando o fuso local
const hoje = new Date().toLocaleDateString("sv-SE");

// remove acentos para bater com os valores aceitos pelas CHECK constraints
// do banco (ex.: "Hipertensão" -> "Hipertensao", "Não" -> "Nao")
const REGEX_DIACRITICOS = new RegExp("[̀-ͯ]", "g");

function semAcento(texto) {
  return texto.normalize("NFD").replace(REGEX_DIACRITICOS, "");
}

function calcularIdade(dataNascimentoISO) {
  const agora = new Date();
  const nascimento = new Date(`${dataNascimentoISO}T00:00:00`);

  let idade = agora.getFullYear() - nascimento.getFullYear();

  const aindaNaoFezAniversario =
    agora.getMonth() < nascimento.getMonth() ||
    (agora.getMonth() === nascimento.getMonth() &&
      agora.getDate() < nascimento.getDate());

  if (aindaNaoFezAniversario) idade--;

  return idade;
}

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
  dataNascimento: "",
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

function respostaSimNao(valor) {
  const normalizado = semAcento(String(valor || "")).toLowerCase();
  if (normalizado === "sim") return "Sim";
  if (normalizado === "nao") return "Não";
  return "";
}

function respostaComAcentos(valor) {
  const normalizado = semAcento(String(valor || "")).toLowerCase();
  const respostas = {
    nao: "Não",
    hipertensao: "Hipertensão",
    "diabetes gestacional": "Diabetes gestacional",
    anemia: "Anemia",
    outra: "Outra",
    sim: "Sim",
    "ainda nao iniciei": "Ainda não iniciei",
  };
  return respostas[normalizado] || valor || "";
}

function dadosExistentes(gestante, questionario) {
  return {
    ...ESTADO_INICIAL,
    dataNascimento: gestante?.dataNascimento || "",
    tipoSanguineo: questionario?.tipoSanguineo || gestante?.tipoSanguineo || "",
    primeiraGestacao: respostaSimNao(questionario?.primeiraGestacao),
    semanaGestacao: questionario?.semanaGestacional
      ? String(questionario.semanaGestacional)
      : "",
    dpp: questionario?.dataPrevistaParto || "",
    possuiProblemaSaude: questionario?.condicaoSaude
      ? (respostaComAcentos(questionario.condicaoSaude) === "Não" ? "Não" : "Sim")
      : "",
    condicaoSaude: respostaComAcentos(questionario?.condicaoSaude),
    outraCondicao: questionario?.condicaoSaudeOutra || "",
    acompanhamentoPreNatal: respostaComAcentos(questionario?.prenatalRegular),
    possuiAlergia: respostaSimNao(questionario?.possuiAlergia),
    alergia: questionario?.alergiaEspecificacao || "",
    aceitouTermos: Boolean(questionario?.aceiteTermos),
  };
}

const ETAPAS = [
  {
    campo: "dataNascimento",
    pergunta: "Qual é a sua data de nascimento?",
    tipo: "date",
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
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [gestanteExistente, setGestanteExistente] = useState(null);
  const [questionarioExistente, setQuestionarioExistente] = useState(null);
  const [resultado, setResultado] = useState("criado");

  const navigate = useNavigate();
  const { user } = useAuth();

  const etapaAtual = ETAPAS[step - 1];
  const progress = (step / ETAPAS.length) * 100;
  const fase =
    step === 0 ? "inicio" : step <= ETAPAS.length ? "perguntas" : "final";

  useEffect(() => {
    let ativo = true;

    async function carregarQuestionario() {
      try {
        const gestantes = await listarGestantes();
        const gestante = gestantes.find((item) => item.usuario?.id === user.id);
        if (!ativo || !gestante) return;

        setGestanteExistente(gestante);
        const questionarios = await listarQuestionariosPorGestante(gestante.id);
        if (!ativo || questionarios.length === 0) {
          setDados((atuais) => ({
            ...atuais,
            dataNascimento: gestante.dataNascimento || "",
            tipoSanguineo: gestante.tipoSanguineo || "",
          }));
          return;
        }

        const maisRecente = [...questionarios].sort((a, b) => {
          const dataA = new Date(a.dataPreenchimento || 0).getTime();
          const dataB = new Date(b.dataPreenchimento || 0).getTime();
          return dataB - dataA || (b.id || 0) - (a.id || 0);
        })[0];

        setQuestionarioExistente(maisRecente);
        setDados(dadosExistentes(gestante, maisRecente));
      } catch (error) {
        if (ativo) {
          setErroCarregamento(
            error instanceof ApiError
              ? error.message
              : "Não foi possível carregar suas informações de saúde.",
          );
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarQuestionario();
    return () => { ativo = false; };
  }, [user.id]);

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
      } else if (campo === "dataNascimento") {
        if (valor > hoje) {
          novosErros[campo] = "A data de nascimento não pode ser no futuro.";
        }
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

  async function obterOuCriarGestante() {
    const payload = {
      usuario: { id: user.id },
      dataNascimento: dados.dataNascimento,
      observacoes: gestanteExistente?.observacoes || "",
      tipoSanguineo: dados.tipoSanguineo,
    };

    if (gestanteExistente) {
      const atualizada = await atualizarGestante(gestanteExistente.id, payload);
      setGestanteExistente(atualizada);
      return gestanteExistente.id;
    }

    const nova = await criarGestante(payload);
    setGestanteExistente(nova);
    return nova.id;
  }

  async function salvarQuestionario() {
    const gestanteId = await obterOuCriarGestante();

    const payload = {
      gestante: { id: gestanteId },
      idade: calcularIdade(dados.dataNascimento),
      tipoSanguineo: dados.tipoSanguineo,
      semanaGestacional: Number(dados.semanaGestacao),
      primeiraGestacao: semAcento(dados.primeiraGestacao).toLowerCase(),
      dataPrevistaParto: dados.dpp,
      condicaoSaude: semAcento(dados.condicaoSaude),
      condicaoSaudeOutra:
        dados.condicaoSaude === "Outra" ? dados.outraCondicao : null,
      prenatalRegular: semAcento(dados.acompanhamentoPreNatal),
      possuiAlergia: semAcento(dados.possuiAlergia).toLowerCase(),
      alergiaEspecificacao:
        dados.possuiAlergia === "Sim" ? dados.alergia : null,
      aceiteTermos: dados.aceitouTermos,
    };

    if (questionarioExistente) {
      const atualizado = await atualizarQuestionario(
        questionarioExistente.id,
        payload,
      );
      setQuestionarioExistente(atualizado);
      setResultado("atualizado");
      return;
    }

    const criado = await criarQuestionario(payload);
    setQuestionarioExistente(criado);
    setResultado("criado");
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
          error instanceof ApiError
            ? error.message
            : "Não foi possível enviar seus dados. Tente novamente.",
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
      const limiteData =
        campo === "dataNascimento" ? { max: hoje } : { min: hoje };

      return (
        <div className={styles.fieldGroup}>
          <input
            type="date"
            lang="pt-BR"
            {...limiteData}
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

  if (carregando) {
    return (
      <div className={styles.container}>
        <p className={styles.loadingText} role="status">
          Carregando suas informações de saúde...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {/* TELA INICIAL */}
        {fase === "inicio" && (
          <Motion.section
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

            <h1>
              {questionarioExistente
                ? "Atualize suas informações de saúde"
                : "Sua saúde importa"}
            </h1>

            <p>
              {questionarioExistente
                ? "Revise suas respostas quando quiser para manter seu acompanhamento atualizado."
                : "Para oferecer a melhor experiência personalizada, começaremos com um rápido questionário de saúde."}
            </p>

            {erroCarregamento && (
              <p className={styles.loadError} role="alert">
                {erroCarregamento}
              </p>
            )}

            <div className={styles.introActions}>
              <AnimatedButton large onClick={() => setStep(1)}>
                {questionarioExistente
                  ? "REVISAR QUESTIONÁRIO DE SAÚDE"
                  : "INICIAR QUESTIONÁRIO DE SAÚDE"}
              </AnimatedButton>
              <button
                type="button"
                className={styles.laterButton}
                onClick={() => navigate("/perfil")}
              >
                Agora não
              </button>
            </div>
          </Motion.section>
        )}

        {/* QUESTIONÁRIO */}
        {fase === "perguntas" && (
          <Motion.div
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
          </Motion.div>
        )}

        {/* FINAL */}
        {fase === "final" && (
          <Motion.div
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

            <h1 className={styles.finishTitle}>
              {resultado === "atualizado"
                ? "Informações atualizadas!"
                : "Tudo pronto!"}
            </h1>

            <p className={styles.finishText}>
              {resultado === "atualizado"
                ? "Suas informações de saúde foram atualizadas com sucesso."
                : "Seu questionário foi salvo. Você pode alterá-lo quando quiser pelo seu perfil."}
            </p>

            <button
              className={styles.finishButton}
              onClick={() => navigate("/perfil")}
            >
              Voltar para meu perfil
            </button>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
