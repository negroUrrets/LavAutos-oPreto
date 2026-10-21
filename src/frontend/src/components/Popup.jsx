export default function Popup({ message, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-3xl border-2 border-gray-400 bg-brand-pink p-8 text-center shadow-2xl">
        <p className="text-xl font-bold text-blue-600">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-full bg-brand-green px-8 py-2 font-bold text-white"
          

        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
