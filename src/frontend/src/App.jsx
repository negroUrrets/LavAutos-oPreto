import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ClientesPage from './pages/ClientesPage.jsx';
import NuevoClientePage from './pages/NuevoClientePage.jsx';
import ClienteInfoPage from './pages/ClienteInfoPage.jsx';
import EditarClientePage from './pages/EditarClientePage.jsx';
import NuevoVehiculoPage from './pages/NuevoVehiculoPage.jsx';
import EditarVehiculoPage from './pages/EditarVehiculoPage.jsx';
import VehiculosPage from './pages/VehiculosPage.jsx';
import VehiculoInfoPage from './pages/VehiculoInfoPage.jsx';
import NuevoLavadoPage from './pages/NuevoLavadoPage.jsx';
import LavadosPage from './pages/LavadosPage.jsx';
import EditarLavadoPage from './pages/EditarLavadoPage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/clientes" element={<ClientesPage />} />
      <Route path="/clientes/nuevo" element={<NuevoClientePage />} />
      <Route path="/clientes/:id/info" element={<ClienteInfoPage />} />
      <Route path="/clientes/:id/editar" element={<EditarClientePage />} />
      <Route path="/clientes/:id/vehiculos/nuevo" element={<NuevoVehiculoPage />} />
      <Route path="/clientes/:id/vehiculos/:vehiculoId/editar" element={<EditarVehiculoPage />} />
      <Route path="/vehiculos" element={<VehiculosPage />} />
      <Route path="/vehiculos/:vehiculoId/info" element={<VehiculoInfoPage />} />
      <Route path="/clientes/:id/vehiculos/:vehiculoId/lavar" element={<NuevoLavadoPage />} />
      <Route path="/lavados" element={<LavadosPage />} />
      <Route path="/lavados/:lavadoId/editar" element={<EditarLavadoPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
