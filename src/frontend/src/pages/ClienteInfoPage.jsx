import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClienteVehiculoInfo from '../components/ClienteVehiculoInfo.jsx';
import ConfirmPopup from '../components/ConfirmPopup.jsx';
import Popup from '../components/Popup.jsx';
import { fetchSession } from '../services/authService.js';
import { deleteCliente, getCliente } from '../services/clientService.js';
import { listByVehiculo } from '../services/lavadoService.js';
import { deleteVehiculo, listByCliente } from '../services/vehicleService.js';

const ESTADOS_BLOQUEANTES = ['en espera', 'lavando', 'terminado'];

export default function ClienteInfoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [cliente, setCliente] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteVehiculo, setShowDeleteVehiculo] = useState(null);
  const [showLavarWarning, setShowLavarWarning] = useState(false);

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
    } finally {
      navigate('/clientes');
    }
  }

  async function handleConfirmDeleteVehiculo() {
    try {
      await deleteVehiculo(showDeleteVehiculo?.codigoVehi);
    } finally {
      const lista = await listByCliente(id);
      setVehiculos(lista);
      setShowDeleteVehiculo(null);
      navigate(`/clientes/${id}/info`, { replace: true });
    }
  }

  function handleCancelDeleteVehiculo() {
    setShowDeleteVehiculo(null);
    navigate(`/clientes/${id}/info`, { replace: true });
  }

  async function handleLavar(vehiculo) {
    const lavados = await listByVehiculo(vehiculo.codigoVehi);
    const bloqueado = lavados.some((lavado) =>
      ESTADOS_BLOQUEANTES.includes(
        String(lavado.datosEstado?.descripcionEstado ?? '').trim().toLowerCase(),
      ),
    );

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
        onEditarCliente={() => navigate(`/clientes/${id}/editar`)}
        onEliminarCliente={() => setShowDelete(true)}
        onEditarVehiculo={(vehiculo) =>
          navigate(`/clientes/${id}/vehiculos/${vehiculo.codigoVehi}/editar`)
        }
        onEliminarVehiculo={(vehiculo) => setShowDeleteVehiculo(vehiculo)}
        onLavar={handleLavar}
        onVolver={() => navigate('/clientes')}
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
    </>
  );
}
