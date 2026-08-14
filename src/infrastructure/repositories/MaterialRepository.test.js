import { describe, it, expect, vi, beforeEach } from 'vitest';

import apiClient from '../http/apiClient';
import MaterialRepository from './MaterialRepository';

vi.mock('../http/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('MaterialRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listar faz GET /api/materiais', async () => {
    apiClient.get.mockResolvedValue({ data: [{ id: 1 }] });

    const resultado = await MaterialRepository.listar();

    expect(apiClient.get).toHaveBeenCalledWith('/api/materiais');
    expect(resultado).toEqual([{ id: 1 }]);
  });

  it('buscarPorId faz GET /api/materiais/{id}', async () => {
    apiClient.get.mockResolvedValue({ data: { id: 1 } });

    const resultado = await MaterialRepository.buscarPorId(1);

    expect(apiClient.get).toHaveBeenCalledWith('/api/materiais/1');
    expect(resultado).toEqual({ id: 1 });
  });

  it('criar faz POST /api/materiais com o payload', async () => {
    const material = { titulo: 'Cuidados com o Bebê', categoria: 'Bebê' };
    apiClient.post.mockResolvedValue({ data: { id: 1, ...material } });

    const resultado = await MaterialRepository.criar(material);

    expect(apiClient.post).toHaveBeenCalledWith('/api/materiais', material);
    expect(resultado).toEqual({ id: 1, ...material });
  });

  it('atualizar faz PUT /api/materiais/{id}', async () => {
    const material = { titulo: 'Atualizado' };
    apiClient.put.mockResolvedValue({ data: { id: 1, ...material } });

    const resultado = await MaterialRepository.atualizar(1, material);

    expect(apiClient.put).toHaveBeenCalledWith('/api/materiais/1', material);
    expect(resultado).toEqual({ id: 1, ...material });
  });

  it('ativar faz PATCH /api/materiais/{id}/ativar sem corpo', async () => {
    apiClient.patch.mockResolvedValue({});

    await MaterialRepository.ativar(1);

    expect(apiClient.patch).toHaveBeenCalledWith('/api/materiais/1/ativar');
  });

  it('inativar faz PATCH /api/materiais/{id}/inativar sem corpo', async () => {
    apiClient.patch.mockResolvedValue({});

    await MaterialRepository.inativar(1);

    expect(apiClient.patch).toHaveBeenCalledWith('/api/materiais/1/inativar');
  });

  it('remover faz DELETE /api/materiais/{id}', async () => {
    apiClient.delete.mockResolvedValue({});

    await MaterialRepository.remover(1);

    expect(apiClient.delete).toHaveBeenCalledWith('/api/materiais/1');
  });
});
