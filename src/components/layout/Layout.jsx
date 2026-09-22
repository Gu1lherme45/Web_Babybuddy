import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NavBar from './NavBar';
import Footer from './Footer';
import PageWrapper from '../PageWrapper';

const STATIC_ARTICLE_PATHS = [
  '/periodo-gestacional', '/cuidados-bebe', '/tentando-engravidar',
  '/artigos/alimentacao', '/artigos/sono',
];
const NAVBAR_PATHS = ['/sobre', '/login', '/cadastro'];
const FOOTER_PATHS = ['/seguranca', '/termos-de-uso', '/politica-de-privacidade'];

export default function Layout() {
  const location = useLocation();
  const previousRef = useRef(location.pathname);
  const previous = previousRef.current;
  useEffect(() => { previousRef.current = location.pathname; }, [location.pathname]);

  const isArticle = STATIC_ARTICLE_PATHS.includes(location.pathname)
    || /^\/artigos\/\d+$/.test(location.pathname);
  const fast = ['/login', '/cadastro', ...STATIC_ARTICLE_PATHS].includes(location.pathname) || isArticle;
  const skipLoader = location.pathname.startsWith('/administrador')
    || (location.pathname === '/' && [...NAVBAR_PATHS, ...STATIC_ARTICLE_PATHS, ...FOOTER_PATHS].includes(previous));

  return (
    <>
      <NavBar />
      <AnimatePresence>
        <PageWrapper key={location.pathname} skipLoader={skipLoader} duration={fast ? 500 : 700}>
          <Outlet />
        </PageWrapper>
      </AnimatePresence>
      <Footer waveColor={FOOTER_PATHS.includes(location.pathname) || isArticle ? '#f5f5f5' : '#ffffff'} />
    </>
  );
}
