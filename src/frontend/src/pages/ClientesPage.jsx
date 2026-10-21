import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';
import { fetchSession } from '../services/authService.js';
import { searchClientes } from '../services/clientService.js';

const COLUMNS = ['DNI', 'NOMBRE', 'APELLIDO', 'CELULAR'];
const ROW_COLORS = ['#f4e6e6', '#b4b2b2'];

export default function ClientesPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);

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
    const trimmed = term.trim();
    if (trimmed.length < 4) {
      setResults([]);
      return undefined;
    }

    const id = setTimeout(() => {
      searchClientes(trimmed)
        .then(setResults)
        .catch(() => setResults([]));
    }, 300);

    return () => clearTimeout(id);
  }, [term]);

  if (checking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-indigo p-6">
      <AppHeader />

      <div className="mx-auto mt-2 max-w-3xl rounded-3xl border-4 border-gray-500 p-6">
        <span className="inline-block rounded-full bg-[#2637a2] px-6 py-1 text-sm font-bold text-white">
          CLIENTES
        </span>

        <div className="mx-auto mt-4 flex max-w-2xl items-center gap-4 rounded-2xl bg-[#8f8a8a] p-3">
          <input
            type="text"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Dni, Nombre, Apellido..."
            aria-label="Buscar clientes"
            className="flex-1 rounded-full bg-[#f4e6e6] px-4 py-2 text-brand-navy outline-none"
          />
          <button
            type="button"
            onClick={() => navigate('/clientes/nuevo')}
            className="rounded-full bg-green-600 px-6 py-2 font-bold text-white"
          >
            + CLIENTE
          </button>
        </div>

        <div className="mx-auto mt-4 max-w-2xl rounded-2xl bg-[#2637a2] p-4">
          <table className="w-full text-center">
            <thead>
              <tr className="text-gray-400">
                {COLUMNS.map((col) => (
                  <th key={col} className="p-2 text-sm font-bold">
                    {col}
                  </th>
                ))}
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((cliente, index) => (
                  <tr
                    key={cliente.codigoPersona}
                    data-testid="cliente-row"
                    style={{ backgroundColor: ROW_COLORS[index % ROW_COLORS.length] }}
                  >
                    <td className="p-2">{cliente.dni}</td>
                    <td className="p-2">{cliente.nombre}</td>
                    <td className="p-2">{cliente.apellido}</td>
                    <td className="p-2">{cliente.celular}</td>
                    <td className="p-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/clientes/${cliente.codigoPersona}/info`)}
                        className="rounded-full bg-green-600 px-4 py-1 font-bold text-white"
                      >
                        + info
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="p-6 text-center font-bold text-gray-400">
                    Busqueda sin resultados ...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="rounded-2xl bg-green-600 px-4 py-2 text-xl font-bold text-white"
          >
            ← 
          </button>
        </div>
      </div>
    </div>
  );
}
