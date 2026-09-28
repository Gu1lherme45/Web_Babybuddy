import { beforeEach, describe, expect, it, vi } from 'vitest';
import api, { requestWithCsrf } from './api';
import { createMaterial, replaceMaterialImage, listPublicMaterials, setMaterialActive } from './materialService';

vi.mock('./api', () => ({
  default: { get: vi.fn() },
  requestWithCsrf: vi.fn(),
}));

describe('materialService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lista o catálogo público pela API', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1 }] });
    await expect(listPublicMaterials()).resolves.toEqual([{ id: 1 }]);
    expect(api.get).toHaveBeenCalledWith('/api/materiais');
  });

  it('envia cadastro multipart com CSRF', async () => {
    requestWithCsrf.mockResolvedValue({ data: { id: 9 } });
    const pdf = new File(['%PDF-'], 'guia.pdf', { type: 'application/pdf' });
    const cover = new File(['cover'], 'capa.webp', { type: 'image/webp' });
    await expect(createMaterial({ titulo: 'Guia' }, pdf, cover)).resolves.toEqual({ id: 9 });
    const request = requestWithCsrf.mock.calls[0][0];
    expect(request.method).toBe('post');
    expect(request.url).toBe('/api/materiais');
    expect(request.data.get('arquivo')).toBe(pdf);
    expect(request.data.get('imagem')).toBe(cover);
    expect(request.data.has('capa')).toBe(false);
  });

  it('usa a rota explícita de ativação', async () => {
    requestWithCsrf.mockResolvedValue({ data: { statusMaterial: 'ATIVO' } });
    await setMaterialActive(4, true);
    expect(requestWithCsrf).toHaveBeenCalledWith(expect.objectContaining({ url: '/api/materiais/4/ativar' }));
  });

  it('substitui a imagem sem reenviar o texto do artigo', async () => {
    requestWithCsrf.mockResolvedValue({ data: { id: 9, imagem: '/api/materiais/9/imagem' } });
    const image = new File(['image'], 'foto.png', { type: 'image/png' });
    await replaceMaterialImage(9, image);
    const request = requestWithCsrf.mock.calls[0][0];
    expect(request.method).toBe('put');
    expect(request.url).toBe('/api/materiais/9/imagem');
    expect(request.data.get('imagem')).toBe(image);
    expect(request.data.has('arquivo')).toBe(false);
  });
});
