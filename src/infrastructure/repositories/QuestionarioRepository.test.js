import { describe, it, expect, vi, beforeEach } from 'vitest';

import apiClient from '../http/apiClient';
import QuestionarioRepository from './QuestionarioRepository';

vi.mock('../http/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('QuestionarioRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('criar faz POST /api/questionarios com o payload', async () => {
    const questionario = { gestante: { id: 1 }, idade: 28, tipoSanguineo: 'O+' };
    apiClient.post.mockResolvedValue({ data: { id: 1, ...questionario } });

    const resultado = await QuestionarioRepository.criar(questionario);

    expect(apiClient.post).toHaveBeenCalledWith('/api/questionarios', questionario);
    expect(resultado).toEqual({ id: 1, ...questionario });
  });

  it('listar faz GET /api/questionarios', async () => {
    apiClient.get.mockResolvedValue({ data: [{ id: 1 }] });

    const resultado = await QuestionarioRepository.listar();

    expect(apiClient.get).toHaveBeenCalledWith('/api/questionarios');
    expect(resultado).toEqual([{ id: 1 }]);
  });

  it('buscarPorId faz GET /api/questionarios/{id}', async () => {
    apiClient.get.mockResolvedValue({ data: { id: 1 } });

    const resultado = await QuestionarioRepository.buscarPorId(1);

    expect(apiClient.get).toHaveBeenCalledWith('/api/questionarios/1');
    expect(resultado).toEqual({ id: 1 });
  });

  it('listarPorGestante faz GET /api/questionarios/gestante/{gestanteId}', async () => {
    apiClient.get.mockResolvedValue({ data: [{ id: 1 }] });

    const resultado = await QuestionarioRepository.listarPorGestante(1);

    expect(apiClient.get).toHaveBeenCalledWith('/api/questionarios/gestante/1');
    expect(resultado).toEqual([{ id: 1 }]);
  });
});
