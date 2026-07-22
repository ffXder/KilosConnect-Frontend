export const getDateThreshold = (range: string, customStart?: Date | null): Date | null => {
  const now = new Date();
  switch (range) {
    case 'Today':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case 'Yesterday': {
      const d = new Date(now);
      d.setDate(d.getDate() - 1);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case 'Last 7 Days': {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d;
    }
    case 'Last 30 Days': {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return d;
    }
    case 'Custom Range':
      return customStart ?? null;
    default:
      return null;
  }
};

export const isWithinCustomEnd = (date: Date, customEnd?: Date | null): boolean => {
  if (!customEnd) return true;
  const end = new Date(customEnd);
  end.setHours(23, 59, 59, 999); // include the full end day
  return date <= end;
};