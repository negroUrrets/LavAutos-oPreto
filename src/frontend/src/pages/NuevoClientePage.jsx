import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import autoIcon from '../assets/auto.png';
import userIcon from '../assets/usuario.png';
import Popup from '../components/Popup.jsx';
import { fetchSession } from '../services/authService.js';
import { createCliente, searchClientes } from '../services/clientService.js';
import { listCategorias, listMarcas, listModelos } from '../services/vehicleService.js';
import {
  formatPatente,
  isValidEmail,
  isValidPatente,
  onlyDigits,
  onlyLetters,
} from '../utils/validators.js';

const EMPTY_FORM = {
  dni: '',
  nombre: '',
  apellido: '',
  celular: '',
  email: '',
  categoria: '',
  marca: '',
  modelo: '',
  patente: '',
};

export default function NuevoClientePage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
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
        } else {
          setChecking(false);
        }
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

    if (!isValidEmail(form.email)) {
      setWarning('El e-mail no tiene un formato válido.');
      return;
    }

    if (!isValidPatente(form.patente)) {
      setWarning('La patente debe tener el formato AA-123-AA.');
      return;
    }

    const dni = String(form.dni).trim();
    const existentes = await searchClientes(dni);
    const yaExiste = existentes.some((cliente) => String(cliente.dni) === dni);

    if (yaExiste) {
      setPopup({ message: 'Ese cliente ya se encuentra registrado.', action: 'clear' });
      return;
    }

    try {
      await createCliente({
        nombre: form.nombre,
        apellido: form.apellido,
        dni: form.dni,
        email: form.email,
        celular: form.celular,
        vehiculo: {
          patenteVehi: form.patente,
          modeloVehi: form.modelo,
        },
      });
      setPopup({ message: `Bienvenido ${form.nombre}`, action: 'navigate' });
    } catch (error) {
      setWarning(error?.status ? error.message : 'No se pudo registrar el cliente.');
    }
  }

  function handlePopupClose() {
    const action = popup?.action;
    setPopup(null);
    if (action === 'clear') {
      setForm(EMPTY_FORM);
    } else if (action === 'navigate') {
      navigate('/clientes');
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
        <h1 className="text-2xl font-extrabold text-[#5ea014]">Nuevo Cliente</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mt-4 rounded-2xl bg-brand-indigo p-4">
            <div className="mb-3 flex justify-center">
              <img src={userIcon} alt="Usuario" className="h-12 w-12" />
            </div>
            <div className="space-y-3">
              <div>
                <label htmlFor="dni" className={labelClass}>
                  DNI
                </label>
                <input
                  id="dni"
                  name="dni"
                  type="text"
                  value={form.dni}
                  onChange={(event) => updateField('dni', onlyDigits(event.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="nombre" className={labelClass}>
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={(event) => updateField('nombre', onlyLetters(event.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="apellido" className={labelClass}>
                  Apellido
                </label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  value={form.apellido}
                  onChange={(event) => updateField('apellido', onlyLetters(event.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="celular" className={labelClass}>
                  Celular
                </label>
                <input
                  id="celular"
                  name="celular"
                  type="text"
                  value={form.celular}
                  onChange={(event) => updateField('celular', onlyDigits(event.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  e-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-brand-indigo p-4">
            <div className="mb-3 flex justify-center">
              <img src={autoIcon} alt="Vehiculo" className="h-10 w-10" />
            </div>
            <div className="space-y-3">
              <div>
                <label htmlFor="categoria" className={labelClass}>
                  Tipo Vehiculo
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
                  Marca Vehiculo
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
                  Modelo Vehiculo
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
              className="rounded-full bg-[#5ea014] px-8 py-2 font-bold text-white"
            >
              Registrar
            </button>
            <button
              type="button"
              onClick={() => navigate('/clientes')}
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
