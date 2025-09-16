//
// Small formatting utilities
//

// PUBLIC_INTERFACE
export function formatNumber(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "-";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(
    Number(n)
  );
}

// PUBLIC_INTERFACE
export function formatDate(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return String(iso);
  }
}

// PUBLIC_INTERFACE
export function msToHuman(ms) {
  if (ms === null || ms === undefined) return "-";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  if (m < 60) return `${m}m ${rem}s`;
  const h = Math.floor(m / 60);
  const mrem = m % 60;
  return `${h}h ${mrem}m`;
}
