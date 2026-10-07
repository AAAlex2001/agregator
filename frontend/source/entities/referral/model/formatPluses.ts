const numberFormatter = new Intl.NumberFormat("ru-RU");
const pluralRules = new Intl.PluralRules("ru-RU");

const PLUS_FORMS: Record<Intl.LDMLPluralRule, string> = {
  zero: "плюсов",
  one: "плюс",
  two: "плюса",
  few: "плюса",
  many: "плюсов",
  other: "плюса",
};

/** Форматирует количество внутренних баллов: «1 плюс», «3 плюса», «3 000 плюсов». */
export function formatPluses(amount: number): string {
  return `${numberFormatter.format(amount)} ${PLUS_FORMS[pluralRules.select(amount)]}`;
}
