import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, afterEach, afterAll, describe, test, expect } from 'vitest';
import Questionario from './Questionario';
import { AuthProvider } from '../../context/AuthContext';

const USUARIO_LOGADO = {
  id: 7,
  nome: 'Lorena Souza',
  username: 'lorena@gmail.com',
  nivelAcesso: 'Gestante',
};

const server = setupServer(
  http.get('/api/usuarios/me', () => HttpResponse.json(USUARIO_LOGADO, { status: 200 }))
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderQuestionario() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Questionario />
      </AuthProvider>
    </MemoryRouter>
  );
}

function preencherData(valor) {
  const input = document.querySelector('input[type="date"]');
  fireEvent.change(input, { target: { value: valor } });
}

async function preencherSelect(user, valor) {
  const select = screen.getByRole('combobox');
  await user.selectOptions(select, valor);
}

async function clicarOpcao(user, texto) {
  await user.click(screen.getByRole('button', { name: texto }));
}

async function avancar(user) {
  await user.click(
    screen.getByRole('button', { name: /continuar|finalizar questionario/i })
  );
}

// percorre as 13 etapas do questionário com dados válidos e consistentes
// com as CHECK constraints do banco (ver docs/api-rotas.md)
async function preencherQuestionarioCompleto(user) {
  await user.click(screen.getByRole('button', { name: /iniciar questionário de saúde/i }));

  // a troca de fase ("inicio" -> "perguntas") passa por uma animação do
  // framer-motion (AnimatePresence mode="wait"), então o campo só existe
  // no DOM depois que a transição termina — espera pela pergunta aparecer
  await screen.findByText('Qual é a sua data de nascimento?');
  preencherData('1996-05-20'); // dataNascimento
  await avancar(user);

  await preencherSelect(user, 'O+'); // tipoSanguineo
  await avancar(user);

  await clicarOpcao(user, 'Não'); // jaTeveParto
  await avancar(user);

  await clicarOpcao(user, 'Sim'); // primeiraGestacao
  await avancar(user);

  await preencherSelect(user, '12'); // semanaGestacao
  await avancar(user);

  preencherData('2026-12-01'); // dpp
  await avancar(user);

  await clicarOpcao(user, 'Não'); // possuiProblemaSaude
  await avancar(user);

  await preencherSelect(user, 'Hipertensão'); // condicaoSaude
  await avancar(user);

  await clicarOpcao(user, 'Sim'); // acompanhamentoPreNatal
  await avancar(user);

  await clicarOpcao(user, 'Não'); // possuiAlergia
  await avancar(user);

  await clicarOpcao(user, 'Sim'); // cicloRegular
  await avancar(user);

  await clicarOpcao(user, 'Sim'); // autorizaUsoDados
  await avancar(user);

  await user.click(screen.getByRole('checkbox')); // aceitouTermos
  await avancar(user);
}

describe('Questionario — contrato de dados enviado ao backend', () => {
  test('cria uma nova Gestante quando o usuário ainda não tem uma e envia o questionário normalizado', async () => {
    let payloadGestante;
    let payloadQuestionario;

    server.use(
      http.get('/api/gestantes', () => HttpResponse.json([], { status: 200 })),
      http.post('/api/gestantes', async ({ request }) => {
        payloadGestante = await request.json();
        return HttpResponse.json({ id: 10, ...payloadGestante }, { status: 200 });
      }),
      http.post('/api/questionarios', async ({ request }) => {
        payloadQuestionario = await request.json();
        return HttpResponse.json({ id: 1, ...payloadQuestionario }, { status: 200 });
      })
    );

    const user = userEvent.setup();
    renderQuestionario();

    await screen.findByText('Sua saúde importa');
    await preencherQuestionarioCompleto(user);

    expect(await screen.findByText('Tudo pronto!', {}, { timeout: 5000 })).toBeInTheDocument();

    expect(payloadGestante).toEqual({
      usuario: { id: 7 },
      dataNascimento: '1996-05-20',
      observacoes: '',
      tipoSanguineo: 'O+',
    });

    // nenhum valor acentuado ou em desacordo com as CHECK constraints do banco
    expect(payloadQuestionario).toEqual({
      gestante: { id: 10 },
      idade: expect.any(Number),
      tipoSanguineo: 'O+',
      semanaGestacional: 12,
      primeiraGestacao: 'sim',
      dataPrevistaParto: '2026-12-01',
      condicaoSaude: 'Hipertensao',
      condicaoSaudeOutra: null,
      prenatalRegular: 'Sim',
      possuiAlergia: 'nao',
      alergiaEspecificacao: null,
      aceiteTermos: true,
    });
  }, 20000);

  test('reaproveita a Gestante existente do usuário em vez de criar uma nova', async () => {
    let criouGestante = false;
    let payloadQuestionario;

    server.use(
      http.get('/api/gestantes', () =>
        HttpResponse.json(
          [{ id: 99, usuario: { id: 7 }, tipoSanguineo: 'A+' }],
          { status: 200 }
        )
      ),
      http.post('/api/gestantes', () => {
        criouGestante = true;
        return HttpResponse.json({ id: 999 }, { status: 200 });
      }),
      http.post('/api/questionarios', async ({ request }) => {
        payloadQuestionario = await request.json();
        return HttpResponse.json({ id: 2, ...payloadQuestionario }, { status: 200 });
      })
    );

    const user = userEvent.setup();
    renderQuestionario();

    await screen.findByText('Sua saúde importa');
    await preencherQuestionarioCompleto(user);

    expect(await screen.findByText('Tudo pronto!', {}, { timeout: 5000 })).toBeInTheDocument();
    expect(criouGestante).toBe(false);
    expect(payloadQuestionario.gestante).toEqual({ id: 99 });
  }, 20000);
});
