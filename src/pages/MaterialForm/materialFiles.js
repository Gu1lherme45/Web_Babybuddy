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
  if (!file) return 'Selecione um arquivo JPG, PNG, Markdown, PDF ou DOCX.';
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return validatePdf(file);
  const isMarkdown = name.endsWith('.md') || name.endsWith('.markdown');
  const isImage = /\.(jpe?g|png)$/.test(name);
  const isDocx = name.endsWith('.docx');
  if (!isMarkdown && !isImage && !isDocx) return 'Use JPG, PNG, Markdown, PDF ou DOCX.';
  const expectedType = name.endsWith('.png') ? 'image/png' : name.endsWith('.jpg') || name.endsWith('.jpeg') ? 'image/jpeg'
    : isDocx ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'text/markdown';
  if (file.type && file.type !== 'application/octet-stream' && file.type !== expectedType) return 'O tipo do arquivo não corresponde à extensão informada.';
  const maxBytes = isMarkdown ? MAX_TEXT_BYTES : isImage ? 25 * 1024 * 1024 : isDocx ? 25 * 1024 * 1024 : MAX_TEXT_BYTES;
  if (file.size > maxBytes) return isMarkdown ? 'O Markdown deve ter no máximo 5 MB.' : 'O arquivo deve ter no máximo 25 MB.';
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
