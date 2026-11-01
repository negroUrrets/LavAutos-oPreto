import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClienteVehiculoInfo from '../components/ClienteVehiculoInfo.jsx';
import ConfirmPopup from '../components/ConfirmPopup.jsx';
import Popup from '../components/Popup.jsx';
import { fetchSession } from '../services/authService.js';
import { deleteCliente } from '../services/clientService.js';
import { MENSAJE_LAVADO_ACTIVO, tieneLavadoActivo } from '../services/lavadoService.js';
import { deleteVehiculo, getVehiculo, listByCliente } from '../services/vehicleService.js';

function toCliente(vehiculo) {
  const persona = vehiculo?.datosCliente?.persona ?? {};
  return {
    codigoPersona: vehiculo?.cliente ?? vehiculo?.datosCliente?.codigoPersona,
    dni: persona.dni,
    nombre: persona.nombre,
    apellido: persona.apellido,
    celular: persona.celular,
    email: persona.email,
  };
}

export default function VehiculoInfoPage() {
  const { vehiculoId } = useParams();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [vehiculo, setVehiculo] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [showDeleteCliente, setShowDeleteCliente] = useState(false);
  const [showDeleteVehiculo, setShowDeleteVehiculo] = useState(false);
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
        getVehiculo(vehiculoId).then((datos) => {
          if (!active) {
            return;
          }
          setVehiculo(datos);
          setCliente(toCliente(datos));
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
  }, [vehiculoId, navigate]);

  async function clienteBloqueado() {
    const lista = await listByCliente(cliente?.codigoPersona);
    return tieneLavadoActivo(lista.map((item) => item.codigoVehi));
  }

  async function handleEditarCliente() {
    if (await clienteBloqueado()) {
      setShowBloqueo(true);
      return;
    }
    navigate(`/clientes/${cliente?.codigoPersona}/editar`);
  }

  async function handleEliminarCliente() {
    if (await clienteBloqueado()) {
      setShowBloqueo(true);
      return;
    }
    setShowDeleteCliente(true);
  }

  async function handleEditarVehiculo(item) {
    if (await tieneLavadoActivo([item.codigoVehi])) {
      setShowBloqueo(true);
      return;
    }
    navigate(`/clientes/${cliente?.codigoPersona}/vehiculos/${item.codigoVehi}/editar`);
  }

  async function handleEliminarVehiculo(item) {
    if (await tieneLavadoActivo([item.codigoVehi])) {
      setShowBloqueo(true);
      return;
    }
    setShowDeleteVehiculo(true);
  }

  async function handleConfirmDeleteCliente() {
    try {
      await deleteCliente(cliente?.codigoPersona);
      navigate('/clientes');
    } catch (error) {
      setShowDeleteCliente(false);
      if (error.status === 409) {
        setShowBloqueo(true);
        return;
      }
      navigate('/clientes');
    }
  }

  async function handleConfirmDeleteVehiculo() {
    try {
      await deleteVehiculo(vehiculoId);
      navigate('/vehiculos');
    } catch (error) {
      setShowDeleteVehiculo(false);
      if (error.status === 409) {
        setShowBloqueo(true);
        return;
      }
      navigate('/vehiculos');
    }
  }

  if (checking) {
    return null;
  }

  return (
    <>
      <ClienteVehiculoInfo
        cliente={cliente}
        vehiculos={vehiculo ? [vehiculo] : []}
        onNuevoVehiculo={() => navigate(`/clientes/${cliente?.codigoPersona}/vehiculos/nuevo`)}
        onEditarCliente={handleEditarCliente}
        onEliminarCliente={handleEliminarCliente}
        onEditarVehiculo={handleEditarVehiculo}
        onEliminarVehiculo={handleEliminarVehiculo}
        onVolver={() => navigate('/vehiculos')}
      />

      {showDeleteCliente ? (
        <ConfirmPopup
          message={`¿ Desea eliminar al cliente "${cliente?.nombre ?? ''} ${cliente?.apellido ?? ''}" ?`}
          onConfirm={handleConfirmDeleteCliente}
          onCancel={() => setShowDeleteCliente(false)}
        />
      ) : null}

      {showDeleteVehiculo ? (
        <ConfirmPopup
          message={`¿ Desea eliminar el vehiculo "${vehiculo?.patenteVehi ?? ''}" ?`}
          onConfirm={handleConfirmDeleteVehiculo}
          onCancel={() => setShowDeleteVehiculo(false)}
        />
      ) : null}

      {showBloqueo ? (
        <Popup message={MENSAJE_LAVADO_ACTIVO} onClose={() => setShowBloqueo(false)} />
      ) : null}
    </>
  );
}
