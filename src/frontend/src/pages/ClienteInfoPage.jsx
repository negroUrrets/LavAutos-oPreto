import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ClienteVehiculoInfo from '../components/ClienteVehiculoInfo.jsx';
import ConfirmPopup from '../components/ConfirmPopup.jsx';
import Popup from '../components/Popup.jsx';
import { fetchSession } from '../services/authService.js';
import { deleteCliente, getCliente } from '../services/clientService.js';
import { MENSAJE_LAVADO_ACTIVO, tieneLavadoActivo } from '../services/lavadoService.js';
import { deleteVehiculo, listByCliente } from '../services/vehicleService.js';

export default function ClienteInfoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const origen = location.state?.from ?? '/clientes';
  const [checking, setChecking] = useState(true);
  const [cliente, setCliente] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteVehiculo, setShowDeleteVehiculo] = useState(null);
  const [showLavarWarning, setShowLavarWarning] = useState(false);
  const [showBloqueo, setShowBloqueo] = useState(false);

  useEffect(() => {
    let active = true;

    fetchSession()
      .then((ok) => {
        if (!active) {
          return;
        }
        if (!ok) {
          navigate('/login', { replace: true });
          return;
        }
        Promise.all([getCliente(id), listByCliente(id)]).then(([datosCliente, listaVehiculos]) => {
          if (!active) {
            return;
          }
          setCliente(datosCliente);
          setVehiculos(listaVehiculos);
          setChecking(false);
        });
      })
      .catch(() => {
        if (active) {
          navigate('/login', { replace: true });
        }
      });

    return () => {
      active = false;
    };
  }, [id, navigate]);

  async function handleConfirmDelete() {
    try {
      await deleteCliente(id);
      navigate('/clientes');
    } catch (error) {
      setShowDelete(false);
      if (error.status === 409) {
        setShowBloqueo(true);
        return;
      }
      navigate('/clientes');
    }
  }

  async function handleConfirmDeleteVehiculo() {
    try {
      await deleteVehiculo(showDeleteVehiculo?.codigoVehi);
      const lista = await listByCliente(id);
      setVehiculos(lista);
      setShowDeleteVehiculo(null);
      navigate(`/clientes/${id}/info`, { replace: true });
    } catch (error) {
      setShowDeleteVehiculo(null);
      if (error.status === 409) {
        setShowBloqueo(true);
        return;
      }
      navigate(`/clientes/${id}/info`, { replace: true });
    }
  }

  function handleCancelDeleteVehiculo() {
    setShowDeleteVehiculo(null);
    navigate(`/clientes/${id}/info`, { replace: true });
  }

  async function handleEditarCliente() {
    if (await tieneLavadoActivo(vehiculos.map((vehiculo) => vehiculo.codigoVehi))) {
      setShowBloqueo(true);
      return;
    }
    navigate(`/clientes/${id}/editar`);
  }

  async function handleEliminarCliente() {
    if (await tieneLavadoActivo(vehiculos.map((vehiculo) => vehiculo.codigoVehi))) {
      setShowBloqueo(true);
      return;
    }
    setShowDelete(true);
  }

  async function handleEditarVehiculo(vehiculo) {
    if (await tieneLavadoActivo([vehiculo.codigoVehi])) {
      setShowBloqueo(true);
      return;
    }
    navigate(`/clientes/${id}/vehiculos/${vehiculo.codigoVehi}/editar`);
  }

  async function handleEliminarVehiculo(vehiculo) {
    if (await tieneLavadoActivo([vehiculo.codigoVehi])) {
      setShowBloqueo(true);
      return;
    }
    setShowDeleteVehiculo(vehiculo);
  }

  async function handleLavar(vehiculo) {
    const bloqueado = await tieneLavadoActivo([vehiculo.codigoVehi]);

    if (bloqueado) {
      setShowLavarWarning(true);
      return;
    }

    navigate(`/clientes/${id}/vehiculos/${vehiculo.codigoVehi}/lavar`);
  }

  if (checking) {
    return null;
  }

  return (
    <>
      <ClienteVehiculoInfo
        cliente={cliente}
        vehiculos={vehiculos}
        onNuevoVehiculo={() => navigate(`/clientes/${id}/vehiculos/nuevo`)}
        onEditarCliente={handleEditarCliente}
        onEliminarCliente={handleEliminarCliente}
        onEditarVehiculo={handleEditarVehiculo}
        onEliminarVehiculo={handleEliminarVehiculo}
        onLavar={handleLavar}
        onVolver={() => navigate(origen)}
      />

      {showDelete ? (
        <ConfirmPopup
          message={`¿ Desea eliminar al cliente "${cliente?.nombre ?? ''} ${cliente?.apellido ?? ''}" ?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDelete(false)}
        />
      ) : null}

      {showDeleteVehiculo ? (
        <ConfirmPopup
          message={`¿ Desea eliminar el vehiculo "${showDeleteVehiculo.patenteVehi ?? ''}" ?`}
          onConfirm={handleConfirmDeleteVehiculo}
          onCancel={handleCancelDeleteVehiculo}
        />
      ) : null}

      {showLavarWarning ? (
        <Popup
          message="El vehiculo ya tiene un lavado en curso."
          onClose={() => setShowLavarWarning(false)}
        />
      ) : null}

      {showBloqueo ? (
        <Popup message={MENSAJE_LAVADO_ACTIVO} onClose={() => setShowBloqueo(false)} />
      ) : null}
    </>
  );
}
