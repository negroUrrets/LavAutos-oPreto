import userIcon from '../assets/usuario.png';

export default function LogoutPopup({ onConfirm, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-64 rounded-2xl border-2 border-gray-400 bg-gray-300 p-6 text-center">
        <button
          type="button"
          aria-label="Cancelar"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-gray-400 font-bold text-red-600"
        >
          X
        </button>
        <img src={userIcon} alt="Usuario" className="mx-auto h-14 w-14" />
        
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-green-600 px-6 py-2 text-sm font-bold text-white"
          >
            CERRAR SESION
          </button>
        
      </div>
    </div>
  );
}
