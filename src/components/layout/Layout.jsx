import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Layout() {

  const location = useLocation();

  const isTermos = location.pathname === "/termos-de-uso";
  const isPoliticaDePrivacidade = location.pathname === "/politica-de-privacidade";

  return (
    <>
      <NavBar />

      <Outlet />

      <Footer 
        waveColor={isTermos ? "#f5f5f5" : "#ffffff"}
        waveColor={isPoliticaDePrivacidade ? "#f5f5f5" : "#ffffff"}
      />
    </>
  );
}