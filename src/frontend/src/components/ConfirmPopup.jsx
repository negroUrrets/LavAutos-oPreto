export default function ConfirmPopup({ title = '!!! AVISO !!!', message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#e0dede] p-8 text-center">
        <p className="text-lg font-bold text-red-700">{title}</p>
        <p className="mt-3 text-lg font-bold text-red-700">{message}</p>
        <div className="mt-6 flex justify-center gap-6">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-green-600 px-6 py-2 text-sm font-bold text-white"
          >
            ACEPTAR
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-red-600 px-6 py-2 text-sm font-bold text-white"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
}
