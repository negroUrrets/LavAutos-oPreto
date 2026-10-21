import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import autoIcon from '../assets/auto.png';
import Popup from '../components/Popup.jsx';
import { fetchSession } from '../services/authService.js';
import {
  getVehiculo,
  listCategorias,
  listMarcas,
  listModelos,
  listVehiculos,
  updateVehiculo,
} from '../services/vehicleService.js';
import { formatPatente, isValidPatente } from '../utils/validators.js';

const EMPTY_FORM = {
  categoria: '',
  marca: '',
  modelo: '',
  patente: '',
};

function toForm(vehiculo) {
  return {
    categoria: String(vehiculo?.modelo?.marca?.categoria?.codigoCategoriaVehi ?? ''),
    marca: String(vehiculo?.modelo?.marca?.codigoMarcaVehi ?? ''),
    modelo: String(vehiculo?.modelo?.codigoModeloVehi ?? ''),
    patente: vehiculo?.patenteVehi || '',
  };
}

export default function EditarVehiculoPage() {
  const { id, vehiculoId } = useParams();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [original, setOriginal] = useState(EMPTY_FORM);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [warning, setWarning] = useState('');
  const [popup, setPopup] = useState(null);

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
        getVehiculo(vehiculoId).then((vehiculo) => {
          if (!active) {
            return;
          }
          const datos = toForm(vehiculo);
          setOriginal(datos);
          setForm(datos);
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

  useEffect(() => {
    listCategorias().then(setCategorias);
    listMarcas().then(setMarcas);
    listModelos().then(setModelos);
  }, []);

  function updateField(name, value) {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'categoria') {
        next.marca = '';
        next.modelo = '';
      }
      if (name === 'marca') {
        next.modelo = '';
      }
      return next;
    });
  }

  const marcasFiltradas = marcas.filter(
    (marca) => String(marca.categoriaVehi) === String(form.categoria),
  );
  const modelosFiltrados = modelos.filter(
    (modelo) => String(modelo.marcaVehi) === String(form.marca),
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setWarning('');

    const incompleto = Object.values(form).some((value) => !String(value).trim());
    if (incompleto) {
      setWarning('Todos los campos son obligatorios.');
      return;
    }

    if (!isValidPatente(form.patente)) {
      setWarning('La patente debe tener el formato AA-123-AA.');
      return;
    }

    const patente = form.patente.trim().toUpperCase();
    const existentes = await listVehiculos();
    const duplicado = existentes.some(
      (vehiculo) =>
        String(vehiculo.codigoVehi) !== String(vehiculoId) &&
        String(vehiculo.patenteVehi).trim().toUpperCase() === patente,
    );

    if (duplicado) {
      setPopup({ message: 'Error: vehiculo ya registrado', action: 'reset' });
      return;
    }

    try {
      await updateVehiculo(vehiculoId, {
        patenteVehi: form.patente,
        estadoVehi: true,
        cliente: id,
        modeloVehi: form.modelo,
      });
      setPopup({ message: 'El vehiculo se edito correctamente.', action: 'info' });
    } catch {
      setWarning('No se pudo guardar la edición.');
    }
  }

  function handlePopupClose() {
    const action = popup?.action;
    setPopup(null);
    if (action === 'reset') {
      setForm(original);
    } else if (action === 'info') {
      navigate(`/clientes/${id}/info`);
    }
  }

  if (checking) {
    return null;
  }

  const inputClass =
    'mt-1 w-full rounded-full bg-brand-input px-4 py-2 text-white outline-none';
  const labelClass = 'block text-sm font-bold text-white';

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-indigo p-6">
      <div className="w-full max-w-md rounded-3xl bg-brand-pink p-6">
        <h1 className="text-2xl font-extrabold text-[#7eb93c]">Editar Vehiculo</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mt-4 rounded-2xl bg-brand-indigo p-4">
            <div className="mb-3 flex justify-center">
              <img src={autoIcon} alt="Vehiculo" className="h-10 w-10" />
            </div>
            <div className="space-y-3">
              <div>
                <label htmlFor="categoria" className={labelClass}>
                  Vehiculo
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={form.categoria}
                  onChange={(event) => updateField('categoria', event.target.value)}
                  className={inputClass}
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.codigoCategoriaVehi} value={categoria.codigoCategoriaVehi}>
                      {categoria.categoriaVehi}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="marca" className={labelClass}>
                  Marca
                </label>
                <select
                  id="marca"
                  name="marca"
                  value={form.marca}
                  onChange={(event) => updateField('marca', event.target.value)}
                  className={inputClass}
                >
                  <option value="">Seleccionar...</option>
                  {marcasFiltradas.map((marca) => (
                    <option key={marca.codigoMarcaVehi} value={marca.codigoMarcaVehi}>
                      {marca.marcaVehi}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="modelo" className={labelClass}>
                  Modelo
                </label>
                <select
                  id="modelo"
                  name="modelo"
                  value={form.modelo}
                  onChange={(event) => updateField('modelo', event.target.value)}
                  className={inputClass}
                >
                  <option value="">Seleccionar...</option>
                  {modelosFiltrados.map((modelo) => (
                    <option key={modelo.codigoModeloVehi} value={modelo.codigoModeloVehi}>
                      {modelo.modeloVehi}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="patente" className={labelClass}>
                  Patente
                </label>
                <input
                  id="patente"
                  name="patente"
                  type="text"
                  value={form.patente}
                  onChange={(event) => updateField('patente', formatPatente(event.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {warning ? (
            <p role="alert" className="mt-3 text-sm font-bold text-red-700">
              {warning}
            </p>
          ) : null}

          <div className="mt-6 flex justify-center gap-6">
            <button
              type="submit"
              className="rounded-full bg-[#7eb93c] px-8 py-2 font-bold text-white"
            >
              Registrar
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

      {popup ? <Popup message={popup.message} onClose={handlePopupClose} /> : null}
    </div>
  );
}
