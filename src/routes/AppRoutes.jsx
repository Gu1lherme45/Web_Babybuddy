import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ScrollToTop from '../components/ScrollToTop';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home/Home';
import Sobre from '../pages/Sobre/Sobre';
import Cadastro from '../pages/Cadastro/Cadastro';
import Login from '../pages/Login/Login';
import Perfil from '../pages/Perfil/Perfil';
import Administrador from '../pages/Administrador/Administrador';
import MaterialForm from '../pages/MaterialForm/MaterialForm';
import ArtigoDetalhe from '../pages/ArtigoDetalhe/ArtigoDetalhe';
import Artigos from '../pages/Artigos/Artigos';
import Seguranca from '../pages/Seguranca/Seguranca';
import PeriodoGestacional from '../pages/Artigos/PeriodoGestacional';
import CuidadosBebe from '../pages/Artigos/CuidadosBebe';
import TentandoEngravidar from '../pages/Artigos/TentandoEngravidar';
import Alimentacao from '../pages/Artigos/Alimentação';
import SonoArtigo from '../pages/Artigos/Sono';
import Questionario from '../pages/Questionario/Questionario';
import PoliticaDePrivacidade from '../pages/PoliticaDePrivacidade/PoliticaDePrivacidade';
import TermosDeUso from '../pages/TermosDeUso/TermosDeUso';

const admin = (element) => <ProtectedRoute adminOnly>{element}</ProtectedRoute>;

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/seguranca" element={<Seguranca />} />
          <Route path="/periodo-gestacional" element={<PeriodoGestacional />} />
          <Route path="/cuidados-bebe" element={<CuidadosBebe />} />
          <Route path="/tentando-engravidar" element={<TentandoEngravidar />} />
          <Route path="/artigos/alimentacao" element={<Alimentacao />} />
          <Route path="/artigos/sono" element={<SonoArtigo />} />
          <Route path="/artigos/:id" element={<ArtigoDetalhe />} />
          <Route path="/artigos" element={<Artigos />} />
          <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
          <Route path="/termos-de-uso" element={<TermosDeUso />} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/questionario" element={<ProtectedRoute><Questionario /></ProtectedRoute>} />
          <Route path="/administrador" element={admin(<Administrador />)} />
          <Route path="/administrador/materiais/novo" element={admin(<MaterialForm />)} />
          <Route path="/administrador/materiais/:id/editar" element={admin(<MaterialForm />)} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
