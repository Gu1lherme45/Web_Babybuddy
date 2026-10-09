import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Download, ExternalLink, ZoomIn, ZoomOut } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from './ArtigoDetalhe.module.css';
import VerificationCard from '../../components/VerificationCard';
import Loader from '../../components/Loader';
import { absoluteApiUrl } from '../../services/api';
import { getMaterialContent, getPublicMaterial } from '../../services/materialService';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

function escapeHtml(texto) {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Garante parágrafos reais (com espaçamento padrão via CSS) e remove tamanhos de
// fonte herdados da conversão do PDF, para que todo artigo use a fonte padrão do site.
function normalizarConteudo(html) {
  if (!html) return '';
  const documento = new DOMParser().parseFromString(html, 'text/html');

  documento.body.querySelectorAll('[style]').forEach((elemento) => {
    elemento.style.removeProperty('font-size');
    elemento.style.removeProperty('line-height');
    elemento.style.removeProperty('font-family');
  });

  const blocos = documento.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, table');
  if (blocos.length > 1) return documento.body.innerHTML;

  const texto = (documento.body.textContent || '').trim();
  if (!texto) return documento.body.innerHTML;

  const porLinhaDupla = texto.split(/\n\s*\n+/).map((parte) => parte.trim()).filter(Boolean);
  const paragrafos = porLinhaDupla.length > 1 ? porLinhaDupla
    : texto.split(/\n+/).map((parte) => parte.trim()).filter(Boolean);

  if (paragrafos.length <= 1) return `<p>${escapeHtml(texto)}</p>`;
  return paragrafos.map((paragrafo) => `<p>${escapeHtml(paragrafo)}</p>`).join('');
}

export default function ArtigoDetalhe() {
  const { id } = useParams();
  const viewerRef = useRef(null);
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [containerWidth, setContainerWidth] = useState(760);
  const [articleHtml, setArticleHtml] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState('');
  const [pdfText, setPdfText] = useState('');

  useEffect(() => {
    getPublicMaterial(id).then(setMaterial).catch(() => setError('Este artigo não está disponível.')).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!material || material.mimeType === 'application/pdf' || !material.mimeType || !material.mimeType.startsWith('text/')) return;
    let active = true;
    setContentLoading(true);
    getMaterialContent(id)
      .then((html) => { if (active) setArticleHtml(html); })
      .catch(() => { if (active) setContentError('Não foi possível carregar o texto deste artigo.'); })
      .finally(() => { if (active) setContentLoading(false); });
    return () => { active = false; };
  }, [id, material]);

  useEffect(() => {
    if (!viewerRef.current) return undefined;
    const observer = new ResizeObserver(([entry]) => setContainerWidth(Math.max(280, Math.min(820, entry.contentRect.width - 32))));
    observer.observe(viewerRef.current);
    return () => observer.disconnect();
  }, [material]);

  const pdfUrl = useMemo(() => absoluteApiUrl(material?.arquivo), [material]);
  const isPdf = material?.mimeType === 'application/pdf' || (!material?.mimeType && Boolean(material?.arquivo));

  useEffect(() => {
    if (!isPdf || !pdfUrl) { setPdfText(''); return undefined; }
    let active = true;
    pdfjs.getDocument(pdfUrl).promise.then(async (documento) => {
      let texto = '';
      for (let numero = 1; numero <= documento.numPages; numero += 1) {
        const pagina = await documento.getPage(numero);
        const conteudo = await pagina.getTextContent();
        texto += conteudo.items.map((item) => item.str).join(' ') + ' ';
      }
      if (active) setPdfText(texto);
    }).catch(() => { if (active) setPdfText(''); });
    return () => { active = false; };
  }, [isPdf, pdfUrl]);

  // Tempo de leitura calculado a partir da quantidade de letras do conteúdo real
  // (texto extraído do PDF ou HTML convertido), ~1000 letras por minuto.
  const readingMinutes = useMemo(() => {
    const fonte = isPdf ? pdfText : articleHtml.replace(/<[^>]+>/g, ' ');
    if (!fonte) return null;
    const letras = (fonte.match(/\p{L}/gu) || []).length;
    if (!letras) return null;
    return Math.max(1, Math.round(letras / 1000));
  }, [isPdf, pdfText, articleHtml]);

  const conteudoFormatado = useMemo(() => normalizarConteudo(articleHtml), [articleHtml]);

  const aguardandoTexto = !isPdf && material?.mimeType?.startsWith('text/') && contentLoading;

  if (loading || aguardandoTexto) {
    return (
      <main className={styles.page} aria-live="polite" aria-busy="true">
        <div className={styles.heartbeat}><Loader /></div>
      </main>
    );
  }
  if (error || !material) return <main className={styles.state}><h1>Artigo indisponível</h1><p>{error}</p><Link to="/">Voltar ao início</Link></main>;

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <span className={styles.breadcrumb}><Link to="/perfil" className={styles.breadcrumbLink}>Artigos</Link> {material.categoria && `> ${material.categoria}`}</span>
        <h1>{material.titulo}</h1>
        {material.descricao && <p className={styles.subtitle}>{material.descricao}</p>}
        <div className={styles.meta}>
          {readingMinutes ? `⏱️ ${readingMinutes} min de leitura` : '⏱️ Calculando leitura...'}
        </div>
      </div>

      <VerificationCard />

      {isPdf ? (
        <section className={styles.reader} aria-label="Leitor do documento PDF">
          <div className={styles.toolbar}>
            <div className={styles.pageControls}>
              <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1} aria-label="Página anterior"><ChevronLeft /></button>
              <span>Página {page} de {pages || '—'}</span>
              <button type="button" onClick={() => setPage((value) => Math.min(pages, value + 1))} disabled={!pages || page >= pages} aria-label="Próxima página"><ChevronRight /></button>
            </div>
            <div className={styles.documentActions}>
              <button type="button" onClick={() => setZoom((value) => Math.max(.7, value - .1))} aria-label="Diminuir zoom"><ZoomOut /></button>
              <span>{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => setZoom((value) => Math.min(1.8, value + .1))} aria-label="Aumentar zoom"><ZoomIn /></button>
              <a href={pdfUrl} target="_blank" rel="noreferrer" aria-label="Abrir PDF original"><ExternalLink /></a>
              <a href={pdfUrl} download={material.nomeArquivo || true} aria-label="Baixar PDF"><Download /></a>
            </div>
          </div>
          <div className={styles.viewer} ref={viewerRef}>
            <Document file={pdfUrl} suspense={false} loading={<p>Carregando documento...</p>}
              error={<p>Não foi possível abrir este documento.</p>}
              onLoadSuccess={({ numPages }) => { setPages(numPages); setPage(1); }}>
              <Page pageNumber={page} width={containerWidth} scale={zoom} suspense={false} />
            </Document>
          </div>
        </section>
      ) : material.mimeType?.startsWith('image/') ? (
        <div className={styles.container}><img src={absoluteApiUrl(material.arquivo)} alt={material.titulo} style={{ display: 'block', maxWidth: '100%', height: 'auto', margin: '0 auto' }} /></div>
      ) : material.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
        <div className={styles.container}><section className={styles.legacy}><h2>Documento Word</h2><p>Baixe o arquivo para abrir o documento.</p><a href={absoluteApiUrl(material.arquivo)} download={material.nomeArquivo || true}>Baixar {material.nomeArquivo || 'documento DOCX'}</a></section></div>
      ) : (
        <div className={styles.container}>
          {material.mimeType?.startsWith('text/') ? (
            contentError ? <p className={styles.contentState}>{contentError}</p>
              : <div className={styles.articleBody} dangerouslySetInnerHTML={{ __html: conteudoFormatado }} />
          ) : material.link ? (
            <section className={styles.legacy}><h2>Conteúdo no formato anterior</h2><p>Este artigo ainda não possui PDF migrado.</p><Link to={material.link}>Ler artigo</Link></section>
          ) : (
            <section className={styles.legacy}><h2>PDF indisponível</h2><p>O documento ainda não foi publicado.</p></section>
          )}
        </div>
      )}
    </main>
  );
}
