import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import ScrollToTop from '../components/ScrollToTop';
import ProtectedRoute from "../components/ProtectedRoute";

import Home from '../pages/Home/Home';
import Sobre from '../pages/Sobre/Sobre';
import Cadastro from '../pages/Cadastro/Cadastro';
import Login from '../pages/Login/Login';
import Perfil from '../pages/Perfil/Perfil';
import Administrador from '../pages/Administrador/Administrador';
import Seguranca from '../pages/Seguranca/Seguranca';

import PeriodoGestacional from '../pages/PeriodoGestacional/PeriodoGestacional';
import CuidadosBebe from '../pages/CuidadosBebe/CuidadosBebe';
import TentandoEngravidar from '../pages/TentandoEngravidar/TentandoEngravidar';
import SonoDoBebe from '../pages/Sono/Sono';
import SaudeMental from '../pages/SaudeMental/SaudeMental';
import Enxoval from '../pages/Enxoval/Enxoval';

import Questionario from '../pages/Questionario/Questionario';

import PoliticaDePrivacidade from '../pages/PoliticaDePrivacidade/PoliticaDePrivacidade';
import TermosDeUso from '../pages/TermosDeUso/TermosDeUso';


export default function AppRoutes() {
  return (
    <BrowserRouter>

      <ScrollToTop />

      <Routes>

        <Route element={<Layout />}>

          {/* PÁGINAS PÚBLICAS */}

          <Route path="/" element={<Home />} />

          <Route path="/sobre" element={<Sobre />} />

          <Route path="/cadastro" element={<Cadastro />} />

          <Route path="/login" element={<Login />} />


          {/* SEGURANÇA */}

          <Route 
            path="/seguranca"
            element={<Seguranca />}
          />


          {/* ARTIGOS */}

          <Route
            path="/periodo-gestacional"
            element={<PeriodoGestacional />}
          />

          <Route
            path="/cuidados-bebe"
            element={<CuidadosBebe />}
          />

          <Route
            path="/tentando-engravidar"
            element={<TentandoEngravidar />}
          />

          <Route
            path="/sono"
            element={<SonoDoBebe />}
          />

          <Route
            path="/saude-mental"
            element={<SaudeMental />}
          />

          <Route
            path="/enxoval"
            element={<Enxoval />}
          />


          {/* POLÍTICAS */}

          <Route
            path="/politica-de-privacidade"
            element={<PoliticaDePrivacidade />}
          />

          <Route
            path="/termos-de-uso"
            element={<TermosDeUso />}
          />



          {/* PÁGINAS PROTEGIDAS */}

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />


          <Route
            path="/questionario"
            element={
              <ProtectedRoute>
                <Questionario />
              </ProtectedRoute>
            }
          />


        <Route
  path="/administrador"
  element={
    <ProtectedRoute adminOnly>
      <Administrador />
    </ProtectedRoute>
  }
/>


        </Route>

      </Routes>

    </BrowserRouter>
  );
}