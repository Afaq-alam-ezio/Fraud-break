// Small helpers for showing money and times.

export const rupees = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

// The backend sends a LocalDateTime. Depending on settings it arrives as
// "2026-10-10T07:13:20.164823" or as [2026, 10, 10, 7, 13, 20, 164823000]. This handles both.
export function toDate(value) {
  if (Array.isArray(value)) {
    const [y, mo, d, h = 0, mi = 0, s = 0, nano = 0] = value;
    return new Date(y, mo - 1, d, h, mi, s, Math.floor(nano / 1e6));
  }
  if (typeof value === 'string') {
    // browsers only agree on 3 decimal places, so cut the extra ones off
    const d = new Date(value.replace(/(\.\d{3})\d+/, '$1'));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === 'number') return new Date(value < 1e12 ? value * 1000 : value);
  return null;
}

export const formatClock = (date) => date.toLocaleTimeString('en-GB', { hour12: false });
export const formatDay = (date) => date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
