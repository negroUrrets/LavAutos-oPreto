import { useState } from 'react';
import autoIcon from '../assets/auto.png';
import userIcon from '../assets/usuario.png';
import BrandHeader from './BrandHeader.jsx';

function InfoRow({ label, value }) {
  return (
    <div className="flex gap-4">
      <dt className="w-24 text-sm font-bold text-gray-300">{label}</dt>
      <dd className="text-sm font-bold text-white">{value}</dd>
    </div>
  );
}

const buttonBase = 'rounded-full px-4 py-1 text-sm font-bold text-white';

export default function ClienteVehiculoInfo({
  cliente,
  vehiculos = [],
  onNuevoVehiculo,
  onEditarCliente,
  onEliminarCliente,
  onEditarVehiculo,
  onEliminarVehiculo,
  onVolver,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  function cardClasses(cardId) {
    const base = 'transition-transform duration-200';
    if (hoveredId === null) {
      return base;
    }
    return `${base} ${hoveredId === cardId ? 'z-10 scale-105' : 'scale-95'}`;
  }

  return (
    <div className="min-h-screen bg-brand-indigo p-6">
      <BrandHeader />

      <div className="mx-auto mt-2 max-w-5xl rounded-3xl border-3 border-blue-900 bg-[#8f8a8a] p-6">
        <div className="flex flex-wrap items-start gap-6">
          <div
            className={cardClasses('cliente')}
            onMouseEnter={() => setHoveredId('cliente')}
            onMouseLeave={() => setHoveredId(null)}
            data-testid="cliente-card"
          >
            <div className="w-100 rounded-2xl bg-[#2637a2] p-6">
              <div className="mt-1 mb-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onNuevoVehiculo}
                  className={`${buttonBase} w-30 h-12 bg-green-600`}
                >
                  + VEHICULO
                </button>
              </div>

              <div className="flex items-center mb-8 gap-4">
                <img src={userIcon} alt="Usuario" className="h-14 w-14" />
                <dl className="space-y-1">
                  <InfoRow label="DNI" value={cliente?.dni} />
                  <InfoRow label="NOMBRE" value={cliente?.nombre} />
                  <InfoRow label="APELLIDO" value={cliente?.apellido} />
                  <InfoRow label="TELEFONO" value={cliente?.celular} />
                  <InfoRow label="e-m@il" value={cliente?.email} />
                </dl>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={onEditarCliente}
                  className={`${buttonBase} bg-gray-400`}
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={onEliminarCliente}
                  className={`${buttonBase} bg-red-600`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          {vehiculos.map((vehiculo) => (
            <div
              key={vehiculo.codigoVehi}
              className={cardClasses(`vehiculo-${vehiculo.codigoVehi}`)}
              onMouseEnter={() => setHoveredId(`vehiculo-${vehiculo.codigoVehi}`)}
              onMouseLeave={() => setHoveredId(null)}
              data-testid="vehiculo-card"
            >
              <div className="w-60 rounded-2xl bg-[#2637a2] p-6">
                <div className="mb-1 flex justify-end gap-2">
                  <button type="button" className={`${buttonBase} w-30 h-12 bg-green-600`}>
                    LAVAR
                  </button>
                </div>
                <img src={autoIcon} alt="Vehiculo" className="h-10 w-10" />
                <dl className="mt-2 space-y-1">
                  <InfoRow
                    label="VEHICULO"
                    value={vehiculo.modelo?.marca?.categoria?.categoriaVehi}
                  />
                  <InfoRow label="MARCA" value={vehiculo.modelo?.marca?.marcaVehi} />
                  <InfoRow label="MODELO" value={vehiculo.modelo?.modeloVehi} />
                  <InfoRow label="PATENTE" value={vehiculo.patenteVehi} />
                </dl>
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEditarVehiculo(vehiculo)}
                    className={`${buttonBase} bg-gray-400`}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onEliminarVehiculo(vehiculo)}
                    className={`${buttonBase} bg-red-600`}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onVolver}
            className="rounded-full bg-green-600 px-8 py-2 font-bold text-white"
          >
            ←
          </button>
        </div>
      </div>
    </div>
  );
}
