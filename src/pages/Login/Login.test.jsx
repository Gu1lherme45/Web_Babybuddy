import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, afterEach, afterAll, describe, test, expect } from 'vitest';
import Login from './Login';
import { AuthProvider } from '../../context/AuthContext';

const server = setupServer(
  http.get('/api/usuarios/me', () => HttpResponse.json({ error: 'Não autenticado' }, { status: 401 }))
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Login — POST /login', () => {
  test('mostra a senha ao clicar no botão de olho', async () => {
    const user = userEvent.setup();
    renderLogin();

    const senhaInput = screen.getByPlaceholderText('Digite sua senha');
    expect(senhaInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: '' }));
    expect(senhaInput).toHaveAttribute('type', 'text');
  });

  test('login com sucesso de usuária comum mostra a tela de boas-vindas', async () => {
    server.use(
      http.post('/login', () =>
        HttpResponse.json({ message: 'Login realizado com sucesso' }, { status: 200 })
      ),
      http.get('/api/usuarios/me', () =>
        HttpResponse.json(
          { id: 3, nome: 'Lorena Souza', username: 'lorena@gmail.com', nivelAcesso: 'Gestante' },
          { status: 200 }
        )
      )
    );

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'lorena@gmail.com');
    await user.type(screen.getByPlaceholderText('Digite sua senha'), 'Lorena@123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/Bem vinda ao seu espaço de/i)).toBeInTheDocument();
  }, 10000);

  test('login com credenciais inválidas mostra erro do backend', async () => {
    server.use(
      http.post('/login', () =>
        HttpResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 })
      )
    );

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'lorena@gmail.com');
    await user.type(screen.getByPlaceholderText('Digite sua senha'), 'SenhaErrada');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText('Usuário ou senha inválidos')).toBeInTheDocument();
  });
});
