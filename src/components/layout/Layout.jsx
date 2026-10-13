import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NavBar from './Navbar';
import Footer from './Footer';
import PageWrapper from '../PageWrapper';

const STATIC_ARTICLE_PATHS = [
  '/periodo-gestacional', '/cuidados-bebe', '/tentando-engravidar',
];
const NAVBAR_PATHS = ['/sobre', '/login', '/cadastro'];
const FOOTER_PATHS = ['/seguranca', '/termos-de-uso', '/politica-de-privacidade'];
// Cor de fundo de cada página, para a onda do footer ficar igual ao fundo acima dela
const WAVE_COLORS = {
  '/termos-de-uso': '#f5f5f5',
  '/politica-de-privacidade': '#f5f5f5',
  '/artigos': '#fff8fb',
};

export default function Layout() {
  const location = useLocation();
  const previousRef = useRef(location.pathname);
  const previous = previousRef.current;
  useEffect(() => { previousRef.current = location.pathname; }, [location.pathname]);

  const isArticle = STATIC_ARTICLE_PATHS.includes(location.pathname)
    || /^\/artigos\/\d+$/.test(location.pathname);
  // Páginas de cadastro/edição de artigo no painel têm fundo rosa clarinho
  // (MaterialForm.module.css), diferente do branco das demais telas do admin
  const isMaterialForm = location.pathname.startsWith('/administrador/materiais');
  const fast = ['/login', '/cadastro', ...STATIC_ARTICLE_PATHS].includes(location.pathname) || isArticle;
  const skipLoader = location.pathname.startsWith('/administrador')
    || (location.pathname === '/questionario' && ['/cadastro', '/perfil'].includes(previous))
    || (location.pathname === '/perfil' && previous === '/questionario')
    || (location.pathname === '/' && [...NAVBAR_PATHS, ...STATIC_ARTICLE_PATHS, ...FOOTER_PATHS].includes(previous));

  return (
    <>
      <NavBar />
      <AnimatePresence>
        <PageWrapper key={location.pathname} skipLoader={skipLoader} duration={fast ? 500 : 700}>
          <Outlet />
        </PageWrapper>
      </AnimatePresence>
      <Footer waveColor={isArticle ? '#f5f5f5' : isMaterialForm ? '#fff8fb' : WAVE_COLORS[location.pathname] || '#ffffff'} />
    </>
  );
}
