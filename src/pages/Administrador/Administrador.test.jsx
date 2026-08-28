import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, afterEach, afterAll, describe, test, expect } from 'vitest';
import Administrador from './Administrador';
import { AuthProvider } from '../../context/AuthContext';

const ADMIN_LOGADO = {
  id: 1,
  nome: 'Administrador',
  username: 'admin@babybuddy.com.br',
  nivelAcesso: 'ADMIN',
};

const MATERIAL_EXISTENTE = {
  id: 42,
  titulo: 'Cuidados com o Bebê',
  descricao: 'Tudo que você precisa saber para cuidar do seu bebê.',
  categoria: 'Bebê',
  link: '/cuidados-bebe',
  arquivo: null,
  autor: 'BabyBuddy',
  statusMaterial: 'ATIVO',
  dataPublicacao: '2026-08-13T10:00:00',
};

const server = setupServer(
  http.get('/api/usuarios/me', () => HttpResponse.json(ADMIN_LOGADO, { status: 200 })),
  http.get('/api/usuarios', () => HttpResponse.json([ADMIN_LOGADO], { status: 200 })),
  http.get('/api/materiais', () => HttpResponse.json([MATERIAL_EXISTENTE], { status: 200 }))
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderAdministrador() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Administrador />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Administrador — CRUD de materiais via backend (/api/materiais)', () => {
  test('lista os materiais vindos de GET /api/materiais', async () => {
    renderAdministrador();
    expect(await screen.findByText('Cuidados com o Bebê')).toBeInTheDocument();
  });

  test('criar artigo dispara POST /api/materiais', async () => {
    let payloadRecebido;
    server.use(
      http.post('/api/materiais', async ({ request }) => {
        payloadRecebido = await request.json();
        return HttpResponse.json(
          { id: 100, ...payloadRecebido, statusMaterial: 'ATIVO', dataPublicacao: '2026-08-28T10:00:00' },
          { status: 200 }
        );
      })
    );

    const user = userEvent.setup();
    renderAdministrador();

    await screen.findByText('Cuidados com o Bebê');
    await user.click(screen.getByRole('button', { name: /novo artigo/i }));

    expect(await screen.findByText('Novo artigo')).toBeInTheDocument();
    expect(payloadRecebido).toEqual({
      titulo: 'Novo artigo',
      descricao: 'Descrição do novo artigo.',
      categoria: 'Categoria',
      link: '/',
      arquivo: null,
      autor: 'Administrador',
    });
  });

  test('editar artigo dispara PUT /api/materiais/{id}', async () => {
    let payloadRecebido;
    server.use(
      http.put('/api/materiais/42', async ({ request }) => {
        payloadRecebido = await request.json();
        return HttpResponse.json(
          { ...MATERIAL_EXISTENTE, ...payloadRecebido },
          { status: 200 }
        );
      })
    );

    const user = userEvent.setup();
    renderAdministrador();

    await screen.findByText('Cuidados com o Bebê');
    await user.click(screen.getByRole('button', { name: /editar/i }));

    const tituloInput = screen.getByDisplayValue('Cuidados com o Bebê');
    await user.clear(tituloInput);
    await user.type(tituloInput, 'Cuidados com o Bebê — atualizado');

    await user.click(screen.getByRole('button', { name: /salvar artigo/i }));

    expect(
      await screen.findByText('Cuidados com o Bebê — atualizado')
    ).toBeInTheDocument();
    expect(payloadRecebido).toEqual({
      titulo: 'Cuidados com o Bebê — atualizado',
      descricao: 'Tudo que você precisa saber para cuidar do seu bebê.',
      categoria: 'Bebê',
      link: '/cuidados-bebe',
      arquivo: null,
      autor: 'BabyBuddy',
      statusMaterial: 'ATIVO',
    });
  });

  test('suspender artigo dispara PATCH /api/materiais/{id}/inativar', async () => {
    let chamouInativar = false;
    server.use(
      http.patch('/api/materiais/42/inativar', () => {
        chamouInativar = true;
        return HttpResponse.json(
          { ...MATERIAL_EXISTENTE, statusMaterial: 'INATIVO' },
          { status: 200 }
        );
      })
    );

    const user = userEvent.setup();
    renderAdministrador();

    await screen.findByText('Cuidados com o Bebê');
    await user.click(screen.getByRole('button', { name: /suspender/i }));

    expect(chamouInativar).toBe(true);
    expect(await screen.findByText('SUSPENSO')).toBeInTheDocument();
  });
});
