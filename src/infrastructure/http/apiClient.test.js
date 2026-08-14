import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const createMock = vi.fn(() => ({ name: 'axios-instance' }));

vi.mock('axios', () => ({
  default: { create: (...args) => createMock(...args) },
}));

describe('apiClient', () => {
  beforeEach(() => {
    vi.resetModules();
    createMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('cria a instância axios com baseURL a partir de VITE_API_URL e withCredentials habilitado', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:8080');

    await import('./apiClient');

    expect(createMock).toHaveBeenCalledWith({
      baseURL: 'http://localhost:8080',
      withCredentials: true,
    });
  });
});
