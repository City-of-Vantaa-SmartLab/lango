export default function formatDateLikePostgres(date) {
  const pad = (x) => x.toString().padStart(2, '0');

  const years = date.getUTCFullYear();
  const months = pad(date.getUTCMonth() + 1);
  const days = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const milliseconds = date.getUTCMilliseconds();

  return `${years}-${months}-${days} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}
