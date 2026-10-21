import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userIcon from '../assets/usuario.png';
import BrandHeader from './BrandHeader.jsx';
import LogoutPopup from './LogoutPopup.jsx';
import { logout } from '../services/authService.js';

export default function AppHeader() {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  async function handleConfirmLogout() {
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  }

  return (
    <header className="flex items-center gap-3">
      <BrandHeader />

      <div className="ml-auto mr-6">
        <button
          type="button"
          onClick={() => setShowLogout(true)}
          className="flex flex-col items-center"
        >
          <img src={userIcon} alt="Usuario" className="h-12 w-12" />
          <span className="mt-1 text-sm font-bold text-brand-navy">ADMIN</span>
        </button>
      </div>

      {showLogout ? (
        <LogoutPopup onConfirm={handleConfirmLogout} onClose={() => setShowLogout(false)} />
      ) : null}
    </header>
  );
}
