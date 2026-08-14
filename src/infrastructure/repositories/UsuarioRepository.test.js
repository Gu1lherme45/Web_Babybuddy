import { describe, it, expect, vi, beforeEach } from 'vitest';

import apiClient from '../http/apiClient';
import UsuarioRepository from './UsuarioRepository';

vi.mock('../http/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('UsuarioRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('criar faz POST /api/usuarios e retorna os dados criados', async () => {
    const usuario = { nome: 'Lorena Souza', username: 'lorena@gmail.com', password: 'Lorena@123', nivelAcesso: 'Gestante' };
    apiClient.post.mockResolvedValue({ data: { id: 3, ...usuario } });

    const resultado = await UsuarioRepository.criar(usuario);

    expect(apiClient.post).toHaveBeenCalledWith('/api/usuarios', usuario);
    expect(resultado).toEqual({ id: 3, ...usuario });
  });

  it('buscarMe faz GET /api/usuarios/me e retorna os dados', async () => {
    apiClient.get.mockResolvedValue({ data: { id: 3, nome: 'Lorena Souza' } });

    const resultado = await UsuarioRepository.buscarMe();

    expect(apiClient.get).toHaveBeenCalledWith('/api/usuarios/me');
    expect(resultado).toEqual({ id: 3, nome: 'Lorena Souza' });
  });

  it('listar faz GET /api/usuarios', async () => {
    apiClient.get.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });

    const resultado = await UsuarioRepository.listar();

    expect(apiClient.get).toHaveBeenCalledWith('/api/usuarios');
    expect(resultado).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('buscarPorId faz GET /api/usuarios/{id}', async () => {
    apiClient.get.mockResolvedValue({ data: { id: 5 } });

    const resultado = await UsuarioRepository.buscarPorId(5);

    expect(apiClient.get).toHaveBeenCalledWith('/api/usuarios/5');
    expect(resultado).toEqual({ id: 5 });
  });

  it('atualizar faz PUT /api/usuarios/{id} com o payload', async () => {
    const dados = { nome: 'Lorena Souza Lima' };
    apiClient.put.mockResolvedValue({ data: { id: 5, ...dados } });

    const resultado = await UsuarioRepository.atualizar(5, dados);

    expect(apiClient.put).toHaveBeenCalledWith('/api/usuarios/5', dados);
    expect(resultado).toEqual({ id: 5, ...dados });
  });

  it('trocarSenha faz PATCH /api/usuarios/{id}/senha com { senha }', async () => {
    apiClient.patch.mockResolvedValue({});

    await UsuarioRepository.trocarSenha(5, 'NovaSenha@123');

    expect(apiClient.patch).toHaveBeenCalledWith('/api/usuarios/5/senha', { senha: 'NovaSenha@123' });
  });

  it('inativar faz PATCH /api/usuarios/{id}/inativar sem corpo', async () => {
    apiClient.patch.mockResolvedValue({});

    await UsuarioRepository.inativar(5);

    expect(apiClient.patch).toHaveBeenCalledWith('/api/usuarios/5/inativar');
  });

  it('remover faz DELETE /api/usuarios/{id}', async () => {
    apiClient.delete.mockResolvedValue({});

    await UsuarioRepository.remover(5);

    expect(apiClient.delete).toHaveBeenCalledWith('/api/usuarios/5');
  });
});
