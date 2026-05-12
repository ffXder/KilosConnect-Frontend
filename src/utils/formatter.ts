export const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatTo24Hour = (timeStr: string) => {
    if (!timeStr) return '';
    const date = new Date(`1970-01-01 ${timeStr}`);
    if (isNaN(date.getTime())) return timeStr; // fallback, return as-is
    return date.toTimeString().slice(0, 5); // "HH:MM"
};

//time formatter
export const parseTimeTo12h = (time: string) => {
  if (!time) return { hour: '', minute: '00', period: 'AM' };
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = String(h % 12 || 12).padStart(2, '0');
  const minute = String(m).padStart(2, '0');
  return { hour, minute, period };
};

export const convertTo24h = (hour: string, minute: string, period: string): string => {
  let h = parseInt(hour);
  if (period === 'AM' && h === 12) h = 0;
  if (period === 'PM' && h !== 12) h += 12;
  return `${String(h).padStart(2, '0')}:${minute}`;
};