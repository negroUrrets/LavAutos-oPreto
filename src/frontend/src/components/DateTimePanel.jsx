import { useEffect, useState } from 'react';
import { formatDate, formatTime } from '../utils/formatDateTime.js';

export default function DateTimePanel() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const { hour, minute, period } = formatTime(now);

  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-3xl bg-brand-panel px-10 py-14 text-center text-white">
      <p className="text-xl font-bold">{formatDate(now)}</p>
      <p className="mt-8">
        <span className="text-5xl font-bold">{hour}</span>
        <span className="text-3xl font-bold">  {minute}</span>
        <span className="ml-2 text-2xl font-bold">{period}</span>
      </p>
    </div>
  );
}
