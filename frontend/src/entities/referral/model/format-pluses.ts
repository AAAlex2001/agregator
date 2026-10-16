const numberFormatter = new Intl.NumberFormat("ru-RU");
const pluralRules = new Intl.PluralRules("ru-RU");

/** Формы слова «плюс» для числительных, которые возвращает Intl.PluralRules. */
const PLUS_FORMS = {
  zero: "плюсов",
  one: "плюс",
  two: "плюса",
  few: "плюса",
  many: "плюсов",
  other: "плюса",
};

/** Форматирует внутренние баллы: «1 плюс», «3 плюса», «3 000 плюсов». */
export function formatPluses(amount: number): string {
  return `${numberFormatter.format(amount)} ${PLUS_FORMS[pluralRules.select(amount)]}`;
}
