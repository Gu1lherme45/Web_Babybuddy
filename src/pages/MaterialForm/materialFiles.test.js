import { describe, expect, it, vi } from 'vitest';
import { createCoverFile, MAX_PDF_BYTES, validateArticleFile, validatePdf } from './materialFiles';

describe('materialFiles', () => {
  it('aceita apenas PDF com extensão, MIME e tamanho válidos', () => {
    expect(validatePdf(new File(['%PDF-'], 'guia.pdf', { type: 'application/pdf' }))).toBe('');
    expect(validatePdf(new File(['texto'], 'guia.txt', { type: 'text/plain' }))).toMatch(/PDF válido/);
    expect(validatePdf({ name: 'grande.pdf', type: 'application/pdf', size: MAX_PDF_BYTES + 1 })).toMatch(/25 MB/);
  });

  it('transforma o canvas da primeira página em capa WebP', async () => {
    const blob = new Blob(['cover'], { type: 'image/webp' });
    const canvas = { toBlob: vi.fn((callback) => callback(blob)) };
    const cover = await createCoverFile(canvas, 'pré-natal.pdf');
    expect(cover.name).toBe('pré-natal-capa.webp');
    expect(cover.type).toBe('image/webp');
    expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.86);
  });

  it('aceita os formatos de material suportados pelo backend', () => {
    for (const [name, type] of [
      ['foto.jpg', 'image/jpeg'], ['foto.png', 'image/png'], ['guia.md', 'text/markdown'],
      ['guia.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ]) {
      expect(validateArticleFile(new File(['conteudo'], name, { type }))).toBe('');
    }
    expect(validateArticleFile(new File(['conteudo'], 'guia.exe', { type: 'application/octet-stream' }))).toMatch(/JPG, PNG, Markdown, PDF ou DOCX/);
  });
});
