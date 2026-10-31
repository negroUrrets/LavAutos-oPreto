import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bubblesIcon from '../assets/burbujas.png';
import BrandHeader from '../components/BrandHeader.jsx';
import Popup from '../components/Popup.jsx';
import { fetchSession } from '../services/authService.js';
import { listEstadosLavado, listLavados, updateLavado } from '../services/lavadoService.js';
import { formatTime } from '../utils/formatDateTime.js';

const SECCIONES = [
  {
    id: 'en-espera',
    titulo: 'En Espera...',
    estados: ['en espera'],
    borde: 'border-red-600',
    etiqueta: 'text-red-700',
    accion: { etiqueta: 'Lavar', popup: 'Lavando Vehiculo', destino: 'Lavando' },
  },
  {
    id: 'lavando',
    titulo: 'Lavando...',
    estados: ['lavando'],
    borde: 'border-yellow-700',
    etiqueta: 'text-yellow-700',
    accion: { etiqueta: 'Completado', popup: 'Lavado Terminado', destino: 'Terminado' },
  },
  {
    id: 'terminado',
    titulo: 'Terminado...',
    estados: ['terminado'],
    borde: 'border-green-600',
    etiqueta: 'text-green-700',
    accion: { etiqueta: 'Entregar', popup: 'Vehiculo Entregado', destino: 'Entregado' },
  },
];

function normalizar(texto) {
  return String(texto ?? '')
    .trim()
    .toLowerCase();
}

function formatHora(valor) {
  if (!valor) {
    return '';
  }
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) {
    return '';
  }
  const { hour, minute, period } = formatTime(fecha);
  return `${hour}:${minute} ${period}`;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex gap-4">
      <dt className="w-28 text-sm font-bold text-brand-navy">{label}</dt>
      <dd className="text-sm font-bold text-brand-navy">{value ?? ''}</dd>
    </div>
  );
}

function LavadoInfoPopup({ lavado, onClose }) {
  const vehiculo = lavado.vehiculo ?? {};
  const modelo = vehiculo.modelo ?? {};
  const persona = vehiculo.datosCliente?.persona ?? {};

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-3xl border-2 border-gray-400 bg-brand-pink p-8">
        <h2 className="text-center text-xl font-bold text-brand-navy">Informacion del Lavado</h2>
        <dl className="mt-4 space-y-1">
          <InfoRow label="PATENTE" value={vehiculo.patenteVehi} />
          <InfoRow label="CATEGORIA" value={lavado.categoria?.descripcionLavado} />
          <InfoRow label="MODELO" value={modelo.modeloVehi} />
          <InfoRow label="MARCA" value={modelo.marca?.marcaVehi} />
          <InfoRow label="DNI" value={persona.dni} />
          <InfoRow label="NOMBRE" value={persona.nombre} />
          <InfoRow label="APELLIDO" value={persona.apellido} />
          <InfoRow label="TELEFONO" value={persona.celular} />
          <InfoRow label="e-m@il" value={persona.email} />
        </dl>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-brand-green px-8 py-2 font-bold text-white"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ arriba }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={arriba ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} />
    </svg>
  );
}

function HandIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="currentColor">
      <path d="M8.5 12.5V6a1.5 1.5 0 0 1 3 0v4.5H12V5a1.5 1.5 0 0 1 3 0v5.5h.5V7a1.5 1.5 0 0 1 3 0v7.5a6.5 6.5 0 0 1-6.5 6.5h-.5A6.5 6.5 0 0 1 5 14.5v-3a1.5 1.5 0 0 1 3 0v1h.5z" />
    </svg>
  );
}

export default function LavadosPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [lavados, setLavados] = useState([]);
  const [estados, setEstados] = useState([]);
  const [colapsadas, setColapsadas] = useState({});
  const [info, setInfo] = useState(null);
  const [avance, setAvance] = useState(null);

  const cargar = useCallback(async () => {
    const [listaLavados, catalogoEstados] = await Promise.all([
      listLavados(),
      listEstadosLavado(),
    ]);
    setLavados(listaLavados);
    setEstados(catalogoEstados);
  }, []);

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
        cargar()
          .then(() => {
            if (active) {
              setChecking(false);
            }
          })
          .catch(() => {
            if (active) {
              setChecking(false);
            }
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
  }, [cargar, navigate]);

  async function handleAcceptAvance() {
    if (!avance) {
      return;
    }
    const { lavado, seccion } = avance;
    const destino = estados.find(
      (estado) => normalizar(estado.descripcionEstado) === normalizar(seccion.accion.destino),
    );
    setAvance(null);

    if (!destino) {
      return;
    }

    await updateLavado(lavado.codigoLavado, { estado: destino.codigoEstado });
    await cargar();
  }

  function lavadosDe(seccion) {
    return lavados.filter((lavado) =>
      seccion.estados.includes(normalizar(lavado.datosEstado?.descripcionEstado)),
    );
  }

  function toggleSeccion(id) {
    setColapsadas((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (checking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-indigo p-6">
      <BrandHeader />

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => navigate('/clientes')}
          className="animate-nuevo-lavado flex items-center gap-2 rounded-full bg-green-600 px-8 py-2 font-bold text-white hover:[animation-play-state:paused]"
        >
          <HandIcon />
          Nuevo Lavado
        </button>
      </div>

      <div className="mx-auto mt-8 max-w-3xl space-y-8">
        {SECCIONES.map((seccion) => {
          const items = lavadosDe(seccion);
          const colapsada = Boolean(colapsadas[seccion.id]);

          return (
            <section key={seccion.id} aria-label={seccion.titulo}>
              <div className="flex items-center gap-3">
                <img
                  src={bubblesIcon}
                  alt=""
                  aria-hidden="true"
                  className="animate-burbuja h-10 w-10"
                />
                <div
                  className={`flex flex-1 items-center gap-3 rounded-full border-2 ${seccion.borde} bg-brand-input px-4 py-1`}
                >
                  <span className={`text-sm font-bold ${seccion.etiqueta}`}>{seccion.titulo}</span>
                  <button
                    type="button"
                    onClick={() => toggleSeccion(seccion.id)}
                    aria-label={`${colapsada ? 'Expandir' : 'Contraer'} ${seccion.titulo}`}
                    className={`ml-auto flex h-6 w-6 items-center justify-center rounded-full border ${seccion.borde} ${seccion.etiqueta}`}
                  >
                    <ChevronIcon arriba={colapsada} />
                  </button>
                </div>
              </div>

              {colapsada ? null : (
                <div className="mt-3 space-y-4">
                  {items.map((lavado) => (
                    <div
                      key={lavado.codigoLavado}
                      className="mx-auto w-full max-w-2xl rounded-2xl border border-white bg-[#2637a2] p-6"
                    >
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">N° Lavado</span>
                          <input
                            readOnly
                            aria-label="N° Lavado"
                            value={lavado.codigoLavado ?? ''}
                            className="w-20 rounded-md bg-brand-pink px-2 py-1 text-sm text-brand-navy"
                          />
                        </label>
                        <label className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">Hora</span>
                          <input
                            readOnly
                            aria-label="Hora"
                            value={formatHora(lavado.fechaHoraLavado)}
                            className="w-28 rounded-md bg-brand-pink px-2 py-1 text-sm text-brand-navy"
                          />
                        </label>
                        <label className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">Patente</span>
                          <input
                            readOnly
                            aria-label="Patente"
                            value={lavado.vehiculo?.patenteVehi ?? ''}
                            className="w-28 rounded-md bg-brand-pink px-2 py-1 text-sm text-brand-navy"
                          />
                        </label>
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setInfo(lavado)}
                          className="rounded-full bg-brand-green px-4 py-1 text-sm font-bold text-white"
                        >
                          + info
                        </button>
                        <button
                          type="button"
                          className="rounded-full bg-gray-400 px-4 py-1 text-sm font-bold text-white"
                        >
                          Editar
                        </button>
                      </div>

                      <div className="mt-3 flex justify-center">
                        <button
                          type="button"
                          onClick={() => setAvance({ lavado, seccion })}
                          className="rounded-full bg-green-600 px-8 py-2 font-bold text-white"
                        >
                          {seccion.accion.etiqueta}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="rounded-full bg-green-600 px-8 py-2 font-bold text-white"
        >
          ←
        </button>
      </div>

      {info ? <LavadoInfoPopup lavado={info} onClose={() => setInfo(null)} /> : null}

      {avance ? (
        <Popup message={avance.seccion.accion.popup} onClose={handleAcceptAvance} />
      ) : null}
    </div>
  );
}
