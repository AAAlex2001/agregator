/** Проверяет длину и состав ИНН выбранной организации или предпринимателя. */
export function isValidInn(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  const hasValidLength = value.length === 10 || value.length === 12;
  const hasOnlyDigits = /^[0-9]*$/.test(value);

  return hasValidLength && hasOnlyDigits;
}
