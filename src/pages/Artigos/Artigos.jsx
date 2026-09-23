import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPublicMaterials } from '../../services/materialService';
import { absoluteApiUrl } from '../../services/api';
import styles from './Artigos.module.css';

export default function Artigos() {
  const [items, setItems] = useState([]);
  useEffect(() => { listPublicMaterials().then(setItems).catch(() => setItems([])); }, []);
  return <main className={styles.page}><header><span>Conteúdo BabyBuddy</span><h1>Todos os artigos</h1><p>Encontre orientações por categoria e leia o conteúdo completo.</p></header><div className={styles.grid}>{items.map((item) => <Link className={styles.card} key={item.id} to={`/artigos/${item.id}`}><img src={item.imagem ? absoluteApiUrl(item.imagem) : '/logo192.png'} alt="" /><small>{item.categoria}</small><h2>{item.titulo}</h2><p>{item.descricao}</p></Link>)}</div></main>;
}
