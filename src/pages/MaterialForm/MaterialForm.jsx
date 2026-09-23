import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { ArrowLeft, FileText, UploadCloud, Plus, Image as ImageIcon } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from './MaterialForm.module.css';
import {
  createMaterial,
  listAdminMaterials,
  replaceMaterialFiles,
  updateMaterialMetadata,
  listMaterialCategories,
  createMaterialCategory,
} from '../../services/materialService';
import { validateArticleFile, validateArticleImage } from './materialFiles';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const EMPTY = { titulo: '', descricao: '', categoria: '', autor: 'BabyBuddy', link: '' };

export default function MaterialForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [form, setForm] = useState(EMPTY);
  const [articleFile, setArticleFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [existing, setExisting] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({ type: '', message: '' });
  const pdfUrl = useMemo(() => articleFile?.name.toLowerCase().endsWith('.pdf') ? URL.createObjectURL(articleFile) : null, [articleFile]);

  useEffect(() => () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); }, [pdfUrl]);

  useEffect(() => {
    listMaterialCategories().then(setCategories).catch(() => setStatus({ type: 'error', message: 'Não foi possível carregar as categorias.' }));
  }, []);

  useEffect(() => {
    if (!editing) return;
    listAdminMaterials().then((materials) => {
      const material = materials.find((item) => String(item.id) === String(id));
      if (!material) throw new Error('Material não encontrado');
      setExisting(material);
      setForm({
        titulo: material.titulo || '', descricao: material.descricao || '',
        categoria: material.categoria || '', autor: material.autor || 'BabyBuddy', link: material.link || '',
      });
    }).catch(() => setStatus({ type: 'error', message: 'Não foi possível carregar o material.' }));
  }, [editing, id]);

  useEffect(() => {
    const warn = (event) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function update(name, value) {
    setDirty(true);
    setForm((current) => ({ ...current, [name]: value }));
  }

  function acceptArticle(file) {
    const validationError = validateArticleFile(file);
    if (validationError) return setStatus({ type: 'error', message: validationError });
    setArticleFile(file);
    setDirty(true);
    setStatus({ type: 'info', message: file.name.toLowerCase().endsWith('.pdf') ? 'O PDF será convertido em texto HTML no servidor e salvo no banco.' : 'Arquivo validado. O artigo será exibido com o estilo BabyBuddy.' });
  }

  function acceptImage(file) {
    const message = validateArticleImage(file);
    if (message) return setStatus({ type: 'error', message });
    setImageFile(file || null); setDirty(true);
  }

  async function addCategory() {
    if (!newCategory.trim()) return;
    try {
      const category = await createMaterialCategory(newCategory.trim());
      setCategories((current) => [...current, category].sort((a, b) => a.nome.localeCompare(b.nome)));
      update('categoria', category.nome); setNewCategory(''); setShowCategoryForm(false);
    } catch (error) { setStatus({ type: 'error', message: error.response?.data?.message || 'Não foi possível criar a categoria.' }); }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!editing && !articleFile) {
      setStatus({ type: 'error', message: 'Selecione o arquivo do artigo.' });
      return;
    }
    setStatus({ type: 'info', message: 'Salvando material...' });
    try {
      const onUploadProgress = ({ loaded, total }) => setProgress(total ? Math.round((loaded / total) * 100) : 0);
      if (editing) {
        await updateMaterialMetadata(id, form);
        if (articleFile) await replaceMaterialFiles(id, articleFile, onUploadProgress);
      } else {
        await createMaterial(form, articleFile, imageFile, onUploadProgress);
      }
      setDirty(false);
      setStatus({ type: 'success', message: 'Material salvo com sucesso.' });
      window.setTimeout(() => navigate('/administrador'), 500);
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Não foi possível salvar o material.' });
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <button type="button" onClick={() => navigate('/administrador')} className={styles.back}><ArrowLeft size={18} /> Voltar</button>
        <div><span className={styles.eyebrow}>Dashboard administrativo</span><h1>{editing ? 'Editar artigo' : 'Novo artigo'}</h1>
          <p>Cadastre os metadados e envie o texto de apresentação do artigo.</p></div>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.panel} aria-labelledby="metadata-title">
          <h2 id="metadata-title">Informações do artigo</h2>
          <label>Título<input value={form.titulo} maxLength={150} onChange={(e) => update('titulo', e.target.value)} required /></label>
          <div className={styles.row}>
            <label>Categoria<div className={styles.categoryRow}><select value={form.categoria} onChange={(e) => update('categoria', e.target.value)} required><option value="">Selecione...</option>{categories.map((item) => <option key={item.id} value={item.nome}>{item.nome}</option>)}</select><button type="button" className={styles.addCategory} onClick={() => setShowCategoryForm((value) => !value)} aria-label="Adicionar categoria"><Plus size={18} /></button></div></label>
            {showCategoryForm && <div className={styles.newCategory}><input value={newCategory} maxLength={100} placeholder="Nova categoria" onChange={(e) => setNewCategory(e.target.value)} /><button type="button" className={styles.secondary} onClick={addCategory}>Adicionar</button></div>}
            <label>Autor<input value={form.autor} maxLength={200} onChange={(e) => update('autor', e.target.value)} required /></label>
          </div>
          <label>Descrição<textarea value={form.descricao} maxLength={500} onChange={(e) => update('descricao', e.target.value)} /></label>
          <label>Rota antiga (opcional)<input value={form.link} maxLength={200} placeholder="/periodo-gestacional"
            onChange={(e) => update('link', e.target.value)} /></label>
        </section>

        <section className={styles.panel} aria-labelledby="image-title"><h2 id="image-title">Imagem de topo</h2><div className={styles.imageUpload} onClick={() => document.getElementById('article-image-input')?.click()}><ImageIcon size={28} /><strong>{imageFile ? imageFile.name : 'Adicionar imagem opcional'}</strong><span>PNG, JPEG ou WebP até 5 MB</span><input id="article-image-input" type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => acceptImage(e.target.files[0])} /></div>{imageFile && <img className={styles.imagePreview} src={URL.createObjectURL(imageFile)} alt="Pré-visualização da imagem do artigo" />}</section>

        <section className={styles.panel} aria-labelledby="pdf-title">
          <h2 id="pdf-title">Texto do artigo</h2>
          <div className={`${styles.dropzone} ${dragging ? styles.dragging : ''}`} role="button" tabIndex={0}
            onClick={() => inputRef.current?.click()} onKeyDown={(e) => ['Enter', ' '].includes(e.key) && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); acceptArticle(e.dataTransfer.files[0]); }}>
            <UploadCloud size={34} /><strong>Arraste o arquivo ou clique para selecionar</strong><span>PDF até 25 MB (convertido para HTML); HTML ou Markdown até 5 MB</span>
            <input ref={inputRef} type="file" accept="application/pdf,.pdf,text/html,.html,.htm,text/markdown,.md,.markdown" hidden onChange={(e) => acceptArticle(e.target.files[0])} />
          </div>
          {(articleFile || existing?.nomeArquivo) && <div className={styles.fileInfo}><FileText size={20} />
            <div><strong>{articleFile?.name || existing.nomeArquivo}</strong><span>{articleFile ? `${(articleFile.size / 1024 / 1024).toFixed(2)} MB` : 'Arquivo atual'}</span></div></div>}
          {pdfUrl && <div className={styles.preview}>
            <Document file={pdfUrl} suspense={false} loading={<p>Carregando prévia...</p>}
              error={<p>Documento inválido.</p>} onLoadError={() => setStatus({ type: 'error', message: 'O PDF não pôde ser lido.' })}>
              <Page pageNumber={1} width={420}
                renderTextLayer={false} renderAnnotationLayer={false} suspense={false} />
            </Document>
            <p>O texto selecionável do PDF será convertido para HTML. PDFs digitalizados precisam passar por OCR antes do envio.</p>
          </div>}
        </section>

        <div className={styles.actions}>
          <div aria-live="polite" className={`${styles.status} ${styles[status.type] || ''}`}>{status.message}</div>
          {progress > 0 && progress < 100 && <progress value={progress} max="100" aria-label="Progresso do upload">{progress}%</progress>}
          <button type="button" className={styles.secondary} onClick={() => navigate('/administrador')}>Cancelar</button>
          <button type="submit" className={styles.primary}>{editing ? 'Salvar alterações' : 'Publicar artigo'}</button>
        </div>
      </form>
    </main>
  );
}
