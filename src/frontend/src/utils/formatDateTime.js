const TIME_ZONE = 'America/Argentina/Buenos_Aires';

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function partsToMap(parts) {
  return parts.reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
}

export function formatDate(date) {
  const parts = new Intl.DateTimeFormat('es-AR', {
    timeZone: TIME_ZONE,
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(date);
  const map = partsToMap(parts);

  return `${capitalize(map.weekday || '')} ${map.day}/${map.month}/${map.year}`;
}

export function formatTime(date) {
  const parts = new Intl.DateTimeFormat('es-AR', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(date);
  const map = partsToMap(parts);
  const period = (map.dayPeriod || '').replace(/[^a-zA-Z]/g, '').toLowerCase() || 'am';

  return { hour: map.hour || '', minute: map.minute || '', period };
}
