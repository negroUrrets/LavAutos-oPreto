import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';
import DateTimePanel from '../components/DateTimePanel.jsx';
import { fetchSession } from '../services/authService.js';

const ACCESS_BUTTONS = ['CLIENTES', 'LAVADOS', 'VEHICULOS', 'DASHBOARD'];

export default function HomePage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

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

  if (checking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-indigo p-6">
      <AppHeader />

      <div className="mx-auto mt-2 max-w-xl rounded-3xl border-4 border-green-700 p-6">
        <div className="mt-2 flex flex-col gap-6 md:flex-row">
          <div className="w-full max-w-xs rounded-3xl border-3 border-gray-400 bg-brand-pink p-6">
            <div className="mt-3 flex flex-col gap-4">
              {ACCESS_BUTTONS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label === 'CLIENTES') {
                      navigate('/clientes');
                    } else if (label === 'VEHICULOS') {
                      navigate('/vehiculos');
                    }
                  }}
                  className="rounded-full bg-brand-input px-6 py-2 font-bold text-white hover:bg-[#5ea014]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <DateTimePanel />
        </div>
      </div>
    </div>
  );
}
