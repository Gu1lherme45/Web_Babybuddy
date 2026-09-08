import { act, renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { AUTH_SESSION_KEY } from '../services/browserStorage';
import { AuthProvider, useAuth } from './AuthContext';

const USER = {
  id: 7,
  nome: 'Lorena Souza',
  username: 'lorena@gmail.com',
  nivelAcesso: 'Gestante',
};

const server = setupServer(
  http.get('/api/usuarios/me', () =>
    HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
  )
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  sessionStorage.clear();
});
afterAll(() => server.close());

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext em produção', () => {
  it('autentica no backend e espelha a sessão sanitizada', async () => {
    server.use(
      http.post('/login', () => HttpResponse.json({ message: 'ok' })),
      http.get('/api/usuarios/me', () => HttpResponse.json(USER))
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(() => result.current.entrar('lorena@gmail.com', 'Senha@123'));

    expect(result.current.usuario).toEqual(USER);
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBe(
      sessionStorage.getItem(AUTH_SESSION_KEY)
    );
    expect(localStorage.getItem(AUTH_SESSION_KEY)).not.toContain('Senha@123');
  });

  it('limpa a sessão quando o backend retorna não autorizado', async () => {
    server.use(http.get('/api/usuarios/me', () => HttpResponse.json(USER)));
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.usuario).toEqual(USER));

    act(() => window.dispatchEvent(new CustomEvent('babybuddy:unauthorized')));

    expect(result.current.usuario).toBeNull();
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
    expect(result.current.mensagemSessao).toMatch(/expirou/i);
  });
});
