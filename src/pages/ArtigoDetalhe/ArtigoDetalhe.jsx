import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, ExternalLink, ZoomIn, ZoomOut } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from './ArtigoDetalhe.module.css';
import { absoluteApiUrl } from '../../services/api';
import { getMaterialContent, getPublicMaterial } from '../../services/materialService';
import defaultArticleImage from '../../assets/logo2.svg';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

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

  useEffect(() => {
    getPublicMaterial(id).then(setMaterial).catch(() => setError('Este artigo não está disponível.')).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!material || material.mimeType === 'application/pdf' || !material.mimeType) return;
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
  const coverUrl = useMemo(() => absoluteApiUrl(material?.imagem || material?.capa) || defaultArticleImage, [material]);
  const isPdf = material?.mimeType === 'application/pdf' || (!material?.mimeType && Boolean(material?.arquivo));

  if (loading) return <main className={styles.state} aria-live="polite">Carregando artigo...</main>;
  if (error || !material) return <main className={styles.state}><h1>Artigo indisponível</h1><p>{error}</p><Link to="/">Voltar ao início</Link></main>;

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <Link to="/perfil" className={styles.back}><ArrowLeft size={18} /> Voltar aos artigos</Link>
        <header className={styles.hero}>
          <div className={styles.copy}>
            <span className={styles.category}>{material.categoria}</span>
            <h1>{material.titulo}</h1>
            <p>{material.descricao}</p>
            <div className={styles.meta}><span>Por {material.autor}</span><span>{formatDate(material.dataPublicacao)}</span></div>
          </div>
          <img src={coverUrl} alt={`Imagem do artigo ${material.titulo}`} className={styles.cover} />
        </header>

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
        ) : material.mimeType?.startsWith('text/') ? (
          <section className={styles.textReader} aria-label="Texto do artigo">
            {contentLoading ? <p className={styles.contentState}>Carregando texto do artigo...</p>
              : contentError ? <p className={styles.contentState}>{contentError}</p>
                : <div className={styles.articleBody} dangerouslySetInnerHTML={{ __html: articleHtml }} />}
          </section>
        ) : material.link ? (
          <section className={styles.legacy}><h2>Conteúdo no formato anterior</h2><p>Este artigo ainda não possui PDF migrado.</p><Link to={material.link}>Ler artigo</Link></section>
        ) : (
          <section className={styles.legacy}><h2>PDF indisponível</h2><p>O documento ainda não foi publicado.</p></section>
        )}
      </article>
    </main>
  );
}

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(value));
}
