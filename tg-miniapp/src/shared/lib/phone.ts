export function formatPhone(value: string): string {
  const all = value.replace(/\D/g, "");
  if (!all) return "";
  let digits = all;
  if (digits[0] === "8") digits = "7" + digits.slice(1);
  if (digits[0] !== "7") digits = "7" + digits;
  digits = digits.slice(0, 11);
  const rest = digits.slice(1);
  let out = "+7";
  if (rest.length) out += " (" + rest.slice(0, 3);
  if (rest.length >= 3) out += ")";
  if (rest.length > 3) out += " " + rest.slice(3, 6);
  if (rest.length > 6) out += "-" + rest.slice(6, 8);
  if (rest.length > 8) out += "-" + rest.slice(8, 10);
  return out;
}

export function phoneApiValue(formatted: string): string {
  const digits = formatted.replace(/\D/g, "");
  return digits ? "+" + digits : "";
}

export function isPhoneComplete(formatted: string): boolean {
  return formatted.replace(/\D/g, "").length >= 11;
}

export const PHONE_PLACEHOLDER = "+7 (999) 999-99-99";
