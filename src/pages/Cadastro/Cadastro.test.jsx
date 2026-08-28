import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, afterEach, afterAll, beforeEach, describe, test, expect } from 'vitest';
import Cadastro from './Cadastro';
import { AuthProvider } from '../../context/AuthContext';

const server = setupServer(
  // sem sessão por padrão — cada teste sobrescreve o que precisa
  http.get('/api/usuarios/me', () => HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })),
  http.post('/api/usuarios', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 3, ...body }, { status: 200 });
  }),
  http.post('/login', () =>
    HttpResponse.json({ message: 'Login realizado com sucesso' }, { status: 200 })
  )
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  localStorage.clear();
});

function renderCadastro() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Cadastro />
      </AuthProvider>
    </MemoryRouter>
  );
}

async function preencherFormulario(user, overrides = {}) {
  const dados = {
    nome: 'Lorena Souza',
    email: 'lorena@gmail.com',
    telefone: '11999999999',
    senha: 'Lorena@123',
    confirmarSenha: 'Lorena@123',
    ...overrides,
  };

  await user.type(screen.getByPlaceholderText('Seu nome completo'), dados.nome);
  await user.type(screen.getByPlaceholderText('seu@email.com'), dados.email);
  if (dados.telefone) {
    await user.type(screen.getByPlaceholderText('(00) 00000-0000'), dados.telefone);
  }
  await user.type(screen.getByPlaceholderText('Mínimo de 8 caracteres'), dados.senha);
  await user.type(
    screen.getByPlaceholderText('Digite sua senha novamente'),
    dados.confirmarSenha
  );
  await user.click(screen.getByRole('checkbox'));
}

describe('Cadastro — envio ao backend (POST /api/usuarios + login automático)', () => {
  test('envia o payload correto, faz login e mostra sucesso quando a API responde 200', async () => {
    let payloadRecebido;
    let loginRecebido;
    server.use(
      http.post('/api/usuarios', async ({ request }) => {
        payloadRecebido = await request.json();
        return HttpResponse.json({ id: 3, ...payloadRecebido }, { status: 200 });
      }),
      http.post('/login', async ({ request }) => {
        loginRecebido = Object.fromEntries(new URLSearchParams(await request.text()));
        return HttpResponse.json({ message: 'Login realizado com sucesso' }, { status: 200 });
      }),
      http.get('/api/usuarios/me', () =>
        HttpResponse.json(
          { id: 3, nome: 'Lorena Souza', username: 'lorena@gmail.com', nivelAcesso: 'Gestante' },
          { status: 200 }
        )
      )
    );

    const user = userEvent.setup();
    renderCadastro();

    await preencherFormulario(user);
    await user.click(screen.getByRole('button', { name: /criar minha conta/i }));

    expect(
      await screen.findByText('Cadastro realizado com sucesso!')
    ).toBeInTheDocument();

    expect(payloadRecebido).toEqual({
      nome: 'Lorena Souza',
      username: 'lorena@gmail.com',
      password: 'Lorena@123',
      nivelAcesso: 'Gestante',
    });
    expect(loginRecebido).toEqual({
      username: 'lorena@gmail.com',
      password: 'Lorena@123',
    });
  });

  test('exibe erro e não navega quando a API responde 400', async () => {
    server.use(
      http.post('/api/usuarios', () =>
        HttpResponse.json({ error: 'E-mail já cadastrado' }, { status: 400 })
      )
    );

    const user = userEvent.setup();
    renderCadastro();

    await preencherFormulario(user);
    await user.click(screen.getByRole('button', { name: /criar minha conta/i }));

    expect(await screen.findByText('E-mail já cadastrado')).toBeInTheDocument();
    expect(screen.queryByText('Cadastro realizado com sucesso!')).not.toBeInTheDocument();
  });

  test('bloqueia o envio quando as senhas não coincidem, sem chamar a API', async () => {
    let chamouApi = false;
    server.use(
      http.post('/api/usuarios', () => {
        chamouApi = true;
        return HttpResponse.json({ id: 3 }, { status: 200 });
      })
    );

    const user = userEvent.setup();
    renderCadastro();

    await preencherFormulario(user, { confirmarSenha: 'OutraSenha@123' });
    await user.click(screen.getByRole('button', { name: /criar minha conta/i }));

    expect(await screen.findByText('As senhas não coincidem.')).toBeInTheDocument();
    expect(chamouApi).toBe(false);
  });
});
