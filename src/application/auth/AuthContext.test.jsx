import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

import apiClient from '../../infrastructure/http/apiClient';
import UsuarioRepository from '../../infrastructure/repositories/UsuarioRepository';
import { AuthProvider, useAuth } from './AuthContext';

vi.mock('../../infrastructure/http/apiClient', () => ({
  default: { post: vi.fn() },
}));

vi.mock('../../infrastructure/repositories/UsuarioRepository', () => ({
  default: { buscarMe: vi.fn() },
}));

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login com sucesso popula usuarioAtual e deriva isAdmin de nivelAcesso', async () => {
    UsuarioRepository.buscarMe
      .mockRejectedValueOnce(new Error('sem sessão ativa'))
      .mockResolvedValueOnce({ id: 1, nome: 'Administrador', nivelAcesso: 'ADMIN' });
    apiClient.post.mockResolvedValue({});

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);

    await act(async () => {
      await result.current.login('admin@babybuddy.com.br', 'Admin@123');
    });

    expect(apiClient.post).toHaveBeenCalledWith('/login', expect.any(URLSearchParams));
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.usuarioAtual.nome).toBe('Administrador');
  });

  it('login com falha rejeita e mantém o usuário deslogado', async () => {
    UsuarioRepository.buscarMe.mockRejectedValue(new Error('sem sessão ativa'));
    apiClient.post.mockRejectedValue({ response: { status: 401, data: { error: 'Usuário ou senha inválidos' } } });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.carregando).toBe(false));

    await expect(
      act(async () => {
        await result.current.login('lorena@gmail.com', 'senha-errada');
      })
    ).rejects.toBeTruthy();

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.usuarioAtual).toBeNull();
  });

  it('logout limpa usuarioAtual e isAuthenticated', async () => {
    UsuarioRepository.buscarMe.mockResolvedValueOnce({ id: 3, nome: 'Lorena Souza', nivelAcesso: 'Gestante' });
    apiClient.post.mockResolvedValue({});

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    await act(async () => {
      await result.current.logout();
    });

    expect(apiClient.post).toHaveBeenCalledWith('/logout');
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.usuarioAtual).toBeNull();
  });
});
