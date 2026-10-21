import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userIcon from '../assets/usuario.png';
import Popup from '../components/Popup.jsx';
import { fetchSession } from '../services/authService.js';
import { getCliente, searchClientes, updateCliente } from '../services/clientService.js';
import { isValidEmail, onlyDigits, onlyLetters } from '../utils/validators.js';

const EMPTY_FORM = { dni: '', nombre: '', apellido: '', celular: '', email: '' };

function toForm(cliente) {
  return {
    dni: cliente?.dni != null ? String(cliente.dni) : '',
    nombre: cliente?.nombre || '',
    apellido: cliente?.apellido || '',
    celular: cliente?.celular != null ? String(cliente.celular) : '',
    email: cliente?.email || '',
  };
}

export default function EditarClientePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [original, setOriginal] = useState(EMPTY_FORM);
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
        getCliente(id).then((cliente) => {
          if (!active) {
            return;
          }
          const datos = toForm(cliente);
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
  }, [id, navigate]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

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

    const dni = String(form.dni).trim();
    const existentes = await searchClientes(dni);
    const duplicado = existentes.some(
      (cliente) => String(cliente.dni) === dni && String(cliente.codigoPersona) !== String(id),
    );

    if (duplicado) {
      setPopup({ message: 'Ese cliente ya se encuentra registrado.', action: 'reset' });
      return;
    }

    try {
      await updateCliente(id, {
        nombre: form.nombre,
        apellido: form.apellido,
        dni: form.dni,
        email: form.email,
        celular: form.celular,
      });
      setPopup({ message: 'La edición de datos se efectuó satisfactoriamente.', action: 'info' });
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

  const inputClass = 'mt-1 w-full rounded-full bg-brand-input px-4 py-2 text-white outline-none';
  const labelClass = 'block text-sm font-bold text-white';

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-indigo p-6">
      <div className="w-full max-w-md rounded-3xl bg-brand-pink p-6">
        <h1 className="text-2xl font-extrabold text-[#7eb93c]">Editar Cliente</h1>

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
                  e-m@il
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
