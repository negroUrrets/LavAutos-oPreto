import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BrandHeader from '../components/BrandHeader.jsx';
import ConfirmPopup from '../components/ConfirmPopup.jsx';
import { fetchSessionData } from '../services/authService.js';
import {
  createLavado,
  listCategoriasLavado,
  listEstadosLavado,
  listUtileria,
  updateUtileria,
} from '../services/lavadoService.js';
import { getVehiculo } from '../services/vehicleService.js';

function codigo(valor) {
  return String(valor);
}

export default function NuevoLavadoPage() {
  const { id, vehiculoId } = useParams();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [vehiculo, setVehiculo] = useState(null);
  const [utilerias, setUtilerias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [seleccion, setSeleccion] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');
  const [detalles, setDetalles] = useState('');
  const [login, setLogin] = useState(null);
  const [warning, setWarning] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let active = true;

    fetchSessionData()
      .then((session) => {
        if (!active) {
          return;
        }
        if (!session) {
          navigate('/login', { replace: true });
          return;
        }
        setLogin(session.codigoLogin);

        Promise.all([
          getVehiculo(vehiculoId),
          listUtileria(),
          listCategoriasLavado(),
          listEstadosLavado(),
        ]).then(([datosVehiculo, listaUtileria, listaCategorias, listaEstados]) => {
          if (!active) {
            return;
          }
          setVehiculo(datosVehiculo);
          setUtilerias(listaUtileria);
          setCategorias(listaCategorias);
          setEstados(
            listaEstados.filter(
              (item) =>
                String(item.descripcionEstado ?? '')
                  .trim()
                  .toLowerCase() !== 'entregado',
            ),
          );
          setSeleccion(
            listaUtileria
              .filter((utileria) => Boolean(utileria.estadoUtileria))
              .map((utileria) => codigo(utileria.codigoUtileria)),
          );
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

  async function toggleUtileria(codigoUtileria) {
    const activa = seleccion.includes(codigoUtileria);
    const nuevoEstado = !activa;

    try {
      await updateUtileria(codigoUtileria, { estadoUtileria: nuevoEstado });
      setSeleccion((prev) =>
        nuevoEstado ? [...prev, codigoUtileria] : prev.filter((item) => item !== codigoUtileria),
      );
      setWarning('');
    } catch {
      setWarning('No se pudo actualizar la utileria.');
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setWarning('');

    if (!categoria) {
      setWarning('Seleccione una categoria.');
      return;
    }
    if (!estado) {
      setWarning('Seleccione un estado.');
      return;
    }
    if (seleccion.length === 0) {
      setWarning('Seleccione al menos una utileria.');
      return;
    }

    setShowConfirm(true);
  }

  async function handleConfirm() {
    try {
      await createLavado({
        vehi: vehiculoId,
        categoriaLavado: categoria,
        estado,
        utileria: seleccion[0],
        detallesLavado: detalles,
        login,
      });
      setShowConfirm(false);
      navigate(`/clientes/${id}/info`);
    } catch {
      setShowConfirm(false);
      setWarning('No se pudo registrar el lavado.');
    }
  }

  function handleCancelConfirm() {
    setShowConfirm(false);
    setCategoria('');
    setEstado('');
    setDetalles('');
    setSeleccion(
      utilerias
        .filter((utileria) => Boolean(utileria.estadoUtileria))
        .map((utileria) => codigo(utileria.codigoUtileria)),
    );
  }

  if (checking) {
    return null;
  }

  const labelClass = 'block text-sm font-bold text-white';

  return (
    <div className="min-h-screen bg-brand-indigo p-6">
      <BrandHeader />

      <div className="mx-auto mt-2 max-w-3xl rounded-3xl border-3 border-blue-900 bg-[#8f8a8a] p-6">
        <h1 className="text-xl font-bold text-brand-navy">
          Nuevo Lavado: <span className="font-extrabold">{vehiculo?.patenteVehi}</span>
        </h1>

        <form onSubmit={handleSubmit} className="mt-4 rounded-2xl bg-[#2637a2] p-6">
          <div className="flex flex-wrap gap-8">
            <div className="flex-1 space-y-3">
              {utilerias.map((utileria) => {
                const valor = codigo(utileria.codigoUtileria);
                return (
                  <label
                    key={valor}
                    className="flex items-center gap-3 text-sm font-bold text-white"
                  >
                    <input
                      type="checkbox"
                      checked={seleccion.includes(valor)}
                      onChange={() => toggleUtileria(valor)}
                      className="h-5 w-5"
                    />
                    {utileria.descripcionUtileria}
                  </label>
                );
              })}
            </div>

            <div className="flex-1 space-y-3">
              {categorias.map((item) => {
                const valor = codigo(item.codigoCategoriaLavado);
                const activa = categoria === valor;
                return (
                  <div
                    key={valor}
                    className="flex items-center justify-between gap-3 text-sm font-bold text-white"
                  >
                    <span>{item.descripcionLavado}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={activa}
                      aria-label={item.descripcionLavado}
                      onClick={() => setCategoria(valor)}
                      className={`h-6 w-12 rounded-full p-1 transition-colors ${
                        activa ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    >
                      <span
                        className={`block h-4 w-4 rounded-full bg-white transition-transform ${
                          activa ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="detalles" className={labelClass}>
              Detalles
            </label>
            <textarea
              id="detalles"
              value={detalles}
              onChange={(event) => setDetalles(event.target.value)}
              placeholder="Detalles..."
              rows={3}
              className="mt-1 w-full rounded-2xl bg-brand-input px-4 py-2 text-white outline-none"
            />
          </div>

          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-3 rounded-xl border border-white px-4 py-2">
              <label htmlFor="estado" className={labelClass}>
                Estado...
              </label>
              <select
                id="estado"
                value={estado}
                onChange={(event) => setEstado(event.target.value)}
                className="rounded-md bg-white px-3 py-1 text-brand-navy outline-none"
              >
                <option value="">Seleccionar...</option>
                {estados.map((item) => (
                  <option key={item.codigoEstado} value={item.codigoEstado}>
                    {item.descripcionEstado}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {warning ? (
            <p role="alert" className="mt-3 text-center text-sm font-bold text-red-700">
              {warning}
            </p>
          ) : null}

          <div className="mt-6 flex justify-center gap-6">
            <button
              type="submit"
              className="rounded-full bg-green-600 px-8 py-2 font-bold text-white"
            >
              Registrar Lavado
            </button>
            <button
              type="button"
              onClick={() => navigate(`/clientes/${id}/info`)}
              className="rounded-full bg-red-600 px-8 py-2 font-bold text-white"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {showConfirm ? (
        <ConfirmPopup
          message={`¿ Desea registrar el lavado del vehiculo "${vehiculo?.patenteVehi ?? ''}" ?`}
          onConfirm={handleConfirm}
          onCancel={handleCancelConfirm}
        />
      ) : null}
    </div>
  );
}
