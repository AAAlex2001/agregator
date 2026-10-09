type PluralForms = [one: string, few: string, many: string];

/** Форма слова под число: 1 статья, 2 статьи, 5 статей. */
export const plural = (count: number, forms: PluralForms): string => {
  const tens = Math.abs(count) % 100;
  const units = tens % 10;

  if (tens > 10 && tens < 20) return forms[2];
  if (units === 1) return forms[0];
  if (units >= 2 && units <= 4) return forms[1];

  return forms[2];
};

/** Счётчик с подписью: «12 статей». */
export const countLabel = (count: number, forms: PluralForms) => `${count} ${plural(count, forms)}`;
