export function isValidInn(value: string | null | undefined): boolean {
  if (!value) return false;
  return (value.length === 10 || value.length === 12) && Array.from(value).every((char) => char >= "0" && char <= "9");
}
