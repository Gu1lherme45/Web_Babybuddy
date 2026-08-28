import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, afterEach, afterAll, describe, test, expect } from 'vitest';
import Perfil from './Perfil';
import { AuthProvider } from '../../context/AuthContext';

const USUARIO_LOGADO = {
  id: 5,
  nome: 'Lorena Souza',
  username: 'lorena@gmail.com',
  nivelAcesso: 'Gestante',
};

const server = setupServer(
  http.get('/api/usuarios/me', () => HttpResponse.json(USUARIO_LOGADO, { status: 200 })),
  http.get('/api/materiais', () => HttpResponse.json([], { status: 200 }))
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPerfil() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Perfil />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Perfil — persistência via backend (PUT /api/usuarios/{id})', () => {
  test('carrega os dados do usuário logado via GET /api/usuarios/me', async () => {
    renderPerfil();
    expect(await screen.findByText('Lorena Souza')).toBeInTheDocument();
  });

  test('editar e salvar altera o nome e o e-mail via PUT, mantendo a senha atual', async () => {
    let payloadRecebido;
    server.use(
      http.put('/api/usuarios/5', async ({ request }) => {
        payloadRecebido = await request.json();
        return HttpResponse.json({ ...USUARIO_LOGADO, ...payloadRecebido }, { status: 200 });
      })
    );

    const user = userEvent.setup();
    renderPerfil();

    await screen.findByText('Lorena Souza');
    await user.click(screen.getByText('L')); // avatar abre a sidebar
    await user.click(screen.getByRole('button', { name: /editar perfil/i }));

    const nomeInput = screen.getByDisplayValue('Lorena Souza');
    await user.clear(nomeInput);
    await user.type(nomeInput, 'Lorena Souza Lima');

    await user.click(screen.getByRole('button', { name: /salvar alterações/i }));

    expect(await screen.findByRole('button', { name: /editar perfil/i })).toBeInTheDocument();
    expect(payloadRecebido).toEqual({
      nome: 'Lorena Souza Lima',
      username: 'lorena@gmail.com',
      nivelAcesso: 'Gestante',
    });
  });

  test('troca de senha chama PATCH /api/usuarios/{id}/senha', async () => {
    let senhaEnviada;
    server.use(
      http.patch('/api/usuarios/5/senha', async ({ request }) => {
        senhaEnviada = await request.json();
        return new HttpResponse(null, { status: 204 });
      })
    );

    const user = userEvent.setup();
    renderPerfil();

    await screen.findByText('Lorena Souza');
    await user.click(screen.getByText('L'));
    await user.click(screen.getByRole('button', { name: /editar perfil/i }));
    await user.click(screen.getByRole('button', { name: /alterar senha/i }));

    await user.type(screen.getByPlaceholderText('Nova senha'), 'NovaSenha@123');
    await user.type(screen.getByPlaceholderText('Confirmar nova senha'), 'NovaSenha@123');
    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));

    expect(await screen.findByRole('button', { name: /alterar senha/i })).toBeInTheDocument();
    expect(senhaEnviada).toEqual({ senha: 'NovaSenha@123' });
  });
});
