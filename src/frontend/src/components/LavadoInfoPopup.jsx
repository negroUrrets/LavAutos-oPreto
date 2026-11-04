function InfoRow({ label, value }) {
  return (
    <div className="flex gap-4">
      <dt className="w-28 text-sm font-bold text-brand-navy">{label}</dt>
      <dd className="text-sm font-bold text-brand-navy">{value ?? ''}</dd>
    </div>
  );
}

export default function LavadoInfoPopup({ lavado, onClose }) {
  const vehiculo = lavado.vehiculo ?? {};
  const modelo = vehiculo.modelo ?? {};
  const persona = vehiculo.datosCliente?.persona ?? {};
  const utilerias = (lavado.utilerias ?? [])
    .map((utileria) => utileria.descripcionUtileria)
    .filter(Boolean)
    .join(' - ');

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-3xl border-2 border-gray-400 bg-brand-pink p-8">
        <h2 className="text-center text-xl font-bold text-green-600">Informacion del Lavado</h2>
        <dl className="mt-4 space-y-1">
          <InfoRow label="PATENTE" value={vehiculo.patenteVehi} />
          <InfoRow label="CATEGORIA" value={lavado.categoria?.descripcionLavado} />
          <InfoRow label="MODELO" value={modelo.modeloVehi} />
          <InfoRow label="MARCA" value={modelo.marca?.marcaVehi} />
          <InfoRow label="DETALLES" value={lavado.detallesLavado ?? ''} />
          <InfoRow label="UTILERIAS" value={utilerias} />
        </dl>
        <hr className="my-2 border-t border-brand-navy" />
        <dl className="space-y-1">
          <InfoRow label="DNI" value={persona.dni} />
          <InfoRow label="NOMBRE" value={persona.nombre} />
          <InfoRow label="APELLIDO" value={persona.apellido} />
          <InfoRow label="TELEFONO" value={persona.celular} />
          <InfoRow label="e-m@il" value={persona.email} />
        </dl>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-brand-green px-8 py-2 font-bold text-white"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
