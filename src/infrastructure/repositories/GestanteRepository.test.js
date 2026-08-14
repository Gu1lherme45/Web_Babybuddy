import { describe, it, expect, vi, beforeEach } from 'vitest';

import apiClient from '../http/apiClient';
import GestanteRepository from './GestanteRepository';

vi.mock('../http/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe('GestanteRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('criar faz POST /api/gestantes com o payload', async () => {
    const gestante = { usuario: { id: 3 }, dataNascimento: '1998-01-10', tipoSanguineo: 'O+' };
    apiClient.post.mockResolvedValue({ data: { id: 1, ...gestante } });

    const resultado = await GestanteRepository.criar(gestante);

    expect(apiClient.post).toHaveBeenCalledWith('/api/gestantes', gestante);
    expect(resultado).toEqual({ id: 1, ...gestante });
  });

  it('listar faz GET /api/gestantes', async () => {
    apiClient.get.mockResolvedValue({ data: [{ id: 1 }] });

    const resultado = await GestanteRepository.listar();

    expect(apiClient.get).toHaveBeenCalledWith('/api/gestantes');
    expect(resultado).toEqual([{ id: 1 }]);
  });

  it('buscarPorId faz GET /api/gestantes/{id}', async () => {
    apiClient.get.mockResolvedValue({ data: { id: 1 } });

    const resultado = await GestanteRepository.buscarPorId(1);

    expect(apiClient.get).toHaveBeenCalledWith('/api/gestantes/1');
    expect(resultado).toEqual({ id: 1 });
  });

  it('atualizar faz PUT /api/gestantes/{id}', async () => {
    const dados = { observacoes: 'Atualizado' };
    apiClient.put.mockResolvedValue({ data: { id: 1, ...dados } });

    const resultado = await GestanteRepository.atualizar(1, dados);

    expect(apiClient.put).toHaveBeenCalledWith('/api/gestantes/1', dados);
    expect(resultado).toEqual({ id: 1, ...dados });
  });
});
