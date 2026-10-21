import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';
import { fetchSession } from '../services/authService.js';
import { listVehiculos } from '../services/vehicleService.js';

const COLUMNS = ['TIPO', 'MARCA', 'MODELO', 'PATENTE'];
const ROW_COLORS = ['#f4e6e6', '#b4b2b2'];

function matches(vehiculo, termino) {
  const texto = termino.trim().toUpperCase();
  if (!texto) {
    return false;
  }
  const patente = String(vehiculo.patenteVehi ?? '').toUpperCase();
  const modelo = String(vehiculo.modelo?.modeloVehi ?? '').toUpperCase();
  return patente.includes(texto) || modelo.includes(texto);
}

export default function VehiculosPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [term, setTerm] = useState('');
  const [vehiculos, setVehiculos] = useState([]);

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
        listVehiculos().then((lista) => {
          if (active) {
            setVehiculos(lista);
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
  }, [navigate]);

  if (checking) {
    return null;
  }

  const resultados = vehiculos.filter((vehiculo) => matches(vehiculo, term));

  return (
    <div className="min-h-screen bg-brand-indigo p-6">
      <AppHeader />

      <div className="mx-auto mt-2 max-w-3xl rounded-3xl border-4 border-gray-500 p-6">
        <div className="flex items-center justify-between">
          <span className="inline-block rounded-full bg-[#2637a2] px-6 py-1 text-sm font-bold text-white">
            VEHICULOS
          </span>
          <button
            type="button"
            onClick={() => navigate('/clientes')}
            className="rounded-full bg-green-600 px-6 py-2 font-bold text-white"
          >
            + Vehiculo
          </button>
        </div>

        <div className="mx-auto mt-4 flex max-w-2xl items-center rounded-2xl bg-[#8f8a8a] p-3">
          <input
            type="text"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Patente..."
            aria-label="Buscar vehiculos"
            className="flex-1 rounded-full bg-[#f4e6e6] px-4 py-2 text-brand-navy outline-none"
          />
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
              {resultados.length > 0 ? (
                resultados.map((vehiculo, index) => (
                  <tr
                    key={vehiculo.codigoVehi}
                    data-testid="vehiculo-row"
                    style={{ backgroundColor: ROW_COLORS[index % ROW_COLORS.length] }}
                  >
                    <td className="p-2">{vehiculo.modelo?.marca?.categoria?.categoriaVehi}</td>
                    <td className="p-2">{vehiculo.modelo?.marca?.marcaVehi}</td>
                    <td className="p-2">{vehiculo.modelo?.modeloVehi}</td>
                    <td className="p-2">{vehiculo.patenteVehi}</td>
                    <td className="p-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/vehiculos/${vehiculo.codigoVehi}/info`)}
                        className="rounded-full bg-[#7eb93c] px-4 py-1 font-bold text-white"
                      >
                        <span className="text-lg">+</span> info
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
            ← <span className="text-lg">Volver</span>
          </button>
        </div>
      </div>
    </div>
  );
}
