const RUSSIAN_PHONE_DIGITS = 11;

export function normalizeRussianPhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("8")) {
    return `7${digits.slice(1)}`.slice(0, RUSSIAN_PHONE_DIGITS);
  }

  if (digits.startsWith("9")) {
    return `7${digits}`.slice(0, RUSSIAN_PHONE_DIGITS);
  }

  if (!digits.startsWith("7")) {
    return `7${digits}`.slice(0, RUSSIAN_PHONE_DIGITS);
  }

  return digits.slice(0, RUSSIAN_PHONE_DIGITS);
}

export function formatRussianPhone(value: string): string {
  const digits = normalizeRussianPhoneDigits(value);

  if (!digits) {
    return "";
  }

  const local = digits.slice(1);
  let result = "+7";

  if (local.length > 0) {
    result += `-${local.slice(0, 3)}`;
  }
  if (local.length > 3) {
    result += `-${local.slice(3, 6)}`;
  }
  if (local.length > 6) {
    result += `-${local.slice(6, 8)}`;
  }
  if (local.length > 8) {
    result += `-${local.slice(8, 10)}`;
  }

  return result;
}

export function isValidRussianPhone(value: string): boolean {
  return normalizeRussianPhoneDigits(value).length === RUSSIAN_PHONE_DIGITS;
}

export function toRussianPhoneApiValue(value: string): string {
  const digits = normalizeRussianPhoneDigits(value);
  return digits ? `+${digits}` : "";
}