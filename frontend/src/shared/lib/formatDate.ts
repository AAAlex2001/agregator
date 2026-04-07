/** ISO → "07.04.2026" (4-digit year) */
export function formatDateFull(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
