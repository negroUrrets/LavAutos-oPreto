import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';
import LavadoInfoPopup from '../components/LavadoInfoPopup.jsx';
import { fetchSession } from '../services/authService.js';
import { listClientesSinLavados } from '../services/clientService.js';
import { listEstadosLavado, listLavados } from '../services/lavadoService.js';

function normalizar(texto) {
  return String(texto ?? '')
    .trim()
    .toLowerCase();
}

function fechaLocalHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

const HOY = fechaLocalHoy();

const campoBase = 'w-32 rounded-md px-2 py-1 text-sm text-brand-navy outline-none';

function Campo({ etiqueta, valor }) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-sm font-bold text-white">{etiqueta}</span>
      <input
        readOnly
        aria-label={etiqueta}
        value={valor ?? ''}
        className={`${campoBase} bg-brand-pink`}
      />
    </label>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [lavados, setLavados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [infoLavado, setInfoLavado] = useState(null);

  const modo = searchParams.get('modo');
  const desde = searchParams.get('desde') ?? '';
  const hasta = searchParams.get('hasta') ?? '';
  const fecha = searchParams.get('fecha') ?? '';

  const habilitadoLavados = modo === 'lavados';
  const habilitadoClientes = modo === 'clientes';

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
        setChecking(false);
      })
      .catch(() => {
        if (active) {
          navigate('/login', { replace: true });
        }
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (checking) {
      return undefined;
    }

    let active = true;

    async function cargar() {
      if (modo === 'lavados' && desde && hasta) {
        const estados = await listEstadosLavado();
        const entregado = estados.find(
          (estado) => normalizar(estado.descripcionEstado) === 'entregado',
        );
        const lista = entregado
          ? await listLavados({ estado: entregado.codigoEstado, desde, hasta })
          : [];
        if (active) {
          setLavados(lista);
          setClientes([]);
        }
      } else if (modo === 'clientes' && fecha) {
        const lista = await listClientesSinLavados(fecha);
        if (active) {
          setClientes(lista);
          setLavados([]);
        }
      }
    }

    cargar();

    return () => {
      active = false;
    };
  }, [checking, modo, desde, hasta, fecha]);

  function seleccionarModo(nuevoModo) {
    setLavados([]);
    setClientes([]);
    setInfoLavado(null);
    setSearchParams({ modo: nuevoModo });
  }

  function cambiarFecha(campo, valor) {
    const siguiente = new URLSearchParams(searchParams);
    if (valor) {
      siguiente.set(campo, valor);
    } else {
      siguiente.delete(campo);
    }
    siguiente.set('modo', campo === 'fecha' ? 'clientes' : 'lavados');
    setSearchParams(siguiente);
  }

  function abrirCliente(cliente) {
    navigate(`/clientes/${cliente.codigoPersona}/info`, {
      state: { from: `/dashboard?${searchParams.toString()}` },
    });
  }

  if (checking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-indigo p-6">
      <AppHeader />

      <div className="mx-auto mt-2 max-w-5xl rounded-3xl border-3 border-blue-900 p-6">
        <span className="inline-block rounded-2xl bg-brand-navy px-8 py-3 text-sm font-bold text-white">
          DASHBOARD
        </span>

        <div className="mt-4 flex flex-col gap-6 md:flex-row">
          <aside className="w-full max-w-[220px] rounded-3xl bg-[#eed8d8] p-4">
            <div className="flex flex-col gap-8">
              <button
                type="button"
                aria-pressed={habilitadoLavados}
                onClick={() => seleccionarModo('lavados')}
                className={`rounded-lg py-2 text-sm font-bold text-brand-navy hover:bg-[#7eb93c] ${
                  habilitadoLavados ? 'bg-[#7eb93c]' : 'bg-[#eed8d8]'
                }`}
              >
                REGISTRO LAVADOS
              </button>
              <button
                type="button"
                aria-pressed={habilitadoClientes}
                onClick={() => seleccionarModo('clientes')}
                className={`rounded-lg py-2 text-sm font-bold text-brand-navy hover:bg-[#7eb93c] ${
                  habilitadoClientes ? 'bg-[#7eb93c]' : 'bg-[#eed8d8]'
                }`}
              >
                REGISTRO CLIENTES
              </button>
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            <fieldset disabled={!habilitadoLavados}>
              <div
                className={`flex flex-wrap items-center gap-4 rounded-full px-5 py-2 ${
                  habilitadoLavados ? 'bg-[#7eb93c]' : 'bg-[#8f8a8a]'
                }`}
              >
                <span className="text-sm font-bold text-white">Registro de Lavados...</span>
                <label className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Desde...</span>
                  <input
                    type="date"
                    aria-label="Desde..."
                    value={desde}
                    max={HOY}
                    onChange={(event) => cambiarFecha('desde', event.target.value)}
                    className={`${campoBase} ${
                      habilitadoLavados ? 'bg-brand-pink' : 'bg-[#8f8a8a]'
                    }`}
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Hasta...</span>
                  <input
                    type="date"
                    aria-label="Hasta..."
                    value={hasta}
                    min={desde || undefined}
                    max={HOY}
                    onChange={(event) => cambiarFecha('hasta', event.target.value)}
                    className={`${campoBase} ${
                      habilitadoLavados ? 'bg-brand-pink' : 'bg-[#8f8a8a]'
                    }`}
                  />
                </label>
              </div>

              <div className="mt-3 space-y-3">
                {lavados.map((lavado) => (
                  <div
                    key={lavado.codigoLavado}
                    className={`flex flex-wrap items-center gap-4 rounded-2xl p-4 ${
                      habilitadoLavados ? 'bg-[#2637a2]' : 'bg-[#8f8a8a]'
                    }`}
                  >
                    <Campo etiqueta="N° Lavado" valor={lavado.codigoLavado} />
                    <Campo etiqueta="Categoria" valor={lavado.categoria?.descripcionLavado} />
                    <Campo etiqueta="Patente" valor={lavado.vehiculo?.patenteVehi} />
                    <button
                      type="button"
                      onClick={() => setInfoLavado(lavado)}
                      className="ml-auto rounded-full bg-brand-green px-4 py-1 text-sm font-bold text-white"
                    >
                      + info
                    </button>
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset disabled={!habilitadoClientes}>
              <div
                className={`flex flex-wrap items-center gap-4 rounded-full px-5 py-2 ${
                  habilitadoClientes ? 'bg-[#cc0000]' : 'bg-[#8f8a8a]'
                }`}
              >
                <span className="text-sm font-bold text-white">
                  Clientes que NO vuelven desde...
                </span>
                <label className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Seleccione...</span>
                  <input
                    type="date"
                    aria-label="Seleccione..."
                    value={fecha}
                    max={HOY}
                    onChange={(event) => cambiarFecha('fecha', event.target.value)}
                    className={`${campoBase} ${
                      habilitadoClientes ? 'bg-brand-pink' : 'bg-[#8f8a8a]'
                    }`}
                  />
                </label>
              </div>

              <div className="mt-3 space-y-3">
                {clientes.map((cliente) => (
                  <div
                    key={cliente.codigoPersona}
                    className={`flex flex-wrap items-center gap-4 rounded-2xl p-4 ${
                      habilitadoClientes ? 'bg-[#2637a2]' : 'bg-[#8f8a8a]'
                    }`}
                  >
                    <Campo etiqueta="Nombre" valor={cliente.nombre} />
                    <Campo etiqueta="Apellido" valor={cliente.apellido} />
                    <Campo etiqueta="Celular" valor={cliente.celular} />
                    <button
                      type="button"
                      onClick={() => abrirCliente(cliente)}
                      className="ml-auto rounded-full bg-brand-green px-4 py-1 text-sm font-bold text-white"
                    >
                      + info
                    </button>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="rounded-full bg-green-600 px-8 py-2 font-bold text-white"
          >
            ← Volver
          </button>
        </div>
      </div>

      {infoLavado ? (
        <LavadoInfoPopup lavado={infoLavado} onClose={() => setInfoLavado(null)} />
      ) : null}
    </div>
  );
}
