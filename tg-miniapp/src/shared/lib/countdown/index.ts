export const HOUR = 60 * 60 * 1000;
export const FULL_MS = 3 * 24 * HOUR;
const RED_MS = 6 * HOUR;

export function deadlineTime(deadline: string): number {
  if (deadline.includes("T")) return new Date(deadline).getTime();
  const [year, month, day] = deadline.split("-").map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
}

export function countdownLabel(ms: number): string {
  if (ms <= 0) return "Истёк";
  const minutes = Math.floor(ms / 60000);
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  if (days > 0) return `${days}д ${hours}ч`;
  if (hours > 0) return `${hours}ч ${minutes % 60}м`;
  return `${minutes % 60}м`;
}

export function countdownTone(ms: number): "green" | "amber" | "red" {
  if (ms <= RED_MS) return "red";
  if (ms < FULL_MS) return "amber";
  return "green";
}
