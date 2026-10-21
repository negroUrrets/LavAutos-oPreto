import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import autoIcon from '../assets/auto.png';
import bubblesIcon from '../assets/burbujas.png';
import Popup from '../components/Popup.jsx';
import { login } from '../services/authService.js';

const SUCCESS_MESSAGE = '!Bienvenid@!';
const ERROR_MESSAGE = 'Error al iniciar sesion!!!';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setFieldError('');

    if (!usuario.trim() || !contrasena.trim()) {
      setFieldError('Usuario y contraseña son obligatorios.');
      return;
    }

    try {
      const ok = await login(usuario, contrasena);
      setIsSuccess(ok);
      setPopupMessage(ok ? SUCCESS_MESSAGE : ERROR_MESSAGE);
    } catch {
      setPopupMessage(ERROR_MESSAGE);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-indigo  p-4">
      <div className="w-full max-w-md rounded-3xl bg-brand-pink border-2 border-gray-400 px-10 py-12 shadow-2xl">
        <div className="flex flex-col items-center">
          <img src={bubblesIcon} alt="" className="h-8 w-14" />
          <img src={autoIcon} alt="Auto de lavadero" className="h-14 w-18" />
        </div>

        <h1 className="mt-4 text-center text-4xl font-extrabold text-brand-title">
          LavAutos oPreto
        </h1>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="usuario" className="block text-lg font-bold text-brand-navy">
              Usuario
            </label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              className="mt-2 w-full rounded-full bg-brand-input px-5 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label htmlFor="contrasena" className="block text-lg font-bold text-brand-navy">
              Contraseña
            </label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              value={contrasena}
              onChange={(event) => setContrasena(event.target.value)}
              className="mt-2 w-full rounded-full bg-brand-input px-5 py-3 text-white outline-none"
            />
          </div>

          {fieldError ? (
            <p role="alert" className="text-sm font-bold text-red-700">
              {fieldError}
            </p>
          ) : null}

          {/* <button
            type="submit"
            className=" ml-30  rounded-full bg-brand-green py-3 text-xl font-bold text-white"
          >
            Iniciar Sesion
          </button> */}

          <button
  type="submit"
  className="mx-auto block px-12 py-3 text-xl font-bold text-white rounded-full bg-brand-green"
>
  Iniciar Sesion
</button>

 
        </form>
      </div>

      {popupMessage ? (
        <Popup
          message={popupMessage}
          onClose={() => {
            setPopupMessage('');
            if (isSuccess) {
              navigate('/home');
            }
          }}
        />
      ) : null}
    </div>
  );
}
