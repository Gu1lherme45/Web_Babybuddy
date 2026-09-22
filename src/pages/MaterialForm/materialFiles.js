export const MAX_PDF_BYTES = 25 * 1024 * 1024;
export const MAX_TEXT_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateArticleImage(file) {
  if (!file) return '';
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return 'A imagem deve ser PNG, JPEG ou WebP.';
  if (file.size > MAX_IMAGE_BYTES) return 'A imagem deve ter no máximo 5 MB.';
  return '';
}

export function validateArticleFile(file) {
  if (!file) return 'Selecione um arquivo PDF, HTML ou Markdown.';
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return validatePdf(file);
  const isHtml = name.endsWith('.html') || name.endsWith('.htm');
  const isMarkdown = name.endsWith('.md') || name.endsWith('.markdown');
  if (!isHtml && !isMarkdown) return 'Use um arquivo PDF, HTML ou Markdown.';
  if (file.size > MAX_TEXT_BYTES) return 'O arquivo HTML/Markdown deve ter no máximo 5 MB.';
  return '';
}

export function validatePdf(file) {
  if (!file) return 'Selecione um arquivo PDF.';
  if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
    return 'Selecione um arquivo PDF válido.';
  }
  if (file.size > MAX_PDF_BYTES) return 'O PDF deve ter no máximo 25 MB.';
  return '';
}

export function createCoverFile(canvas, pdfName) {
  return new Promise((resolve, reject) => {
    if (!canvas) return reject(new Error('Canvas da capa indisponível'));
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Não foi possível gerar a capa do PDF'));
      resolve(new File([blob], `${pdfName.replace(/\.pdf$/i, '')}-capa.webp`, { type: 'image/webp' }));
    }, 'image/webp', 0.86);
  });
}
