
import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import NavBar from "./NavBar";
import Footer from "./Footer";
import PageWrapper from "../PageWrapper";

const ARTICLE_PATHS = [
  "/periodo-gestacional",
  "/cuidados-bebe",
  "/tentando-engravidar",
  "/artigos/alimentacao",
  "/artigos/sono",
];

const FAST_LOADER_PATHS = ["/login", "/cadastro", ...ARTICLE_PATHS];

const FOOTER_PATHS = [
  "/seguranca",
  "/termos-de-uso",
  "/politica-de-privacidade",
];

const NAVBAR_PATHS = ["/sobre", "/login", "/cadastro"];

// rotas que, ao voltar pra Home, não devem mostrar o loader
const HOME_RETURN_SKIP_PATHS = [
  ...NAVBAR_PATHS,
  ...ARTICLE_PATHS,
  ...FOOTER_PATHS,
];

export default function Layout() {
  const location = useLocation();

  const prevPathnameRef = useRef(location.pathname);
  const previousPathname = prevPathnameRef.current;

  useEffect(() => {
    prevPathnameRef.current = location.pathname;
  }, [location.pathname]);

  const isTermos = location.pathname === "/termos-de-uso";
  const isPolitica = location.pathname === "/politica-de-privacidade";

  // "Início" e "Artigos" no menu são âncoras da própria Home ("/"),
  // então voltando de artigos, links da navbar (sobre/login/cadastro)
  // ou do footer pra Home, essa transição não deve mostrar o loader
  const skipLoader =
    location.pathname === "/" &&
    HOME_RETURN_SKIP_PATHS.includes(previousPathname);

  const loaderDuration = FAST_LOADER_PATHS.includes(location.pathname)
    ? 500
    : 700;

  return (
    <>
      <NavBar />

      <AnimatePresence>
        <PageWrapper
          key={location.pathname}
          skipLoader={skipLoader}
          duration={loaderDuration}
        >
          <Outlet />
        </PageWrapper>
      </AnimatePresence>

      <Footer
        waveColor={isTermos || isPolitica  ? "#f5f5f5" : "#ffffff"}
      />
    </>
  );
}

