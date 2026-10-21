import autoIcon from '../assets/auto.png';

export default function BrandHeader() {
  return (
    <div className="flex items-center gap-3">
      <img src={autoIcon} alt="Auto de lavadero" className="h-12 w-12" />
      <span className="text-2xl font-extrabold text-brand-navy">LavAutos oPreto</span>
    </div>
  );
}
