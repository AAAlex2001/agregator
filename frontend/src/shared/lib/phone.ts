/** Количество цифр полного российского номера вместе с кодом страны. */
const RUSSIAN_PHONE_LENGTH = 11;

/** Приводит российский номер к цифрам, начиная с кода страны 7. */
function normalizeRussianPhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("8")) {
    return `7${digits.slice(1)}`.slice(0, RUSSIAN_PHONE_LENGTH);
  }

  if (digits.startsWith("7")) {
    return digits.slice(0, RUSSIAN_PHONE_LENGTH);
  }

  return `7${digits}`.slice(0, RUSSIAN_PHONE_LENGTH);
}

/** Форматирует полный или ещё вводимый номер как +7-999-999-99-99. */
export function formatRussianPhone(value: string): string {
  const digits = normalizeRussianPhoneDigits(value);

  if (!digits) {
    return "";
  }

  const localNumber = digits.slice(1);
  const groups = [
    localNumber.slice(0, 3),
    localNumber.slice(3, 6),
    localNumber.slice(6, 8),
    localNumber.slice(8, 10),
  ].filter(Boolean);

  return ["+7", ...groups].join("-");
}

/** Убирает оформление номера перед отправкой в API. */
export function toRussianPhoneApiValue(value: string): string {
  const digits = normalizeRussianPhoneDigits(value);

  return digits ? `+${digits}` : "";
}
