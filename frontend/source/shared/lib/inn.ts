export const INN_MAX_LENGTH = 12;

export function normalizeInn(value: string): string {
  return value.replace(/\D/g, "").slice(0, INN_MAX_LENGTH);
}

export function isValidInn(value: string): boolean {
  return value.length === 10 || value.length === 12;
}