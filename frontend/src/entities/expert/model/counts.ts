/** Выбирает форму слова для числа: «1 заказ», «2 заказа», «5 заказов». */
function pluralize(count: number, one: string, few: string, many: string): string {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${count} ${many}`;
  }

  if (lastDigit === 1) {
    return `${count} ${one}`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} ${few}`;
  }

  return `${count} ${many}`;
}

/** Подбирает подпись количества выполненных заказов исполнителя. */
export function formatOrderCount(count: number): string {
  return pluralize(count, "заказ", "заказа", "заказов");
}

/** Подбирает подпись количества отзывов об исполнителе. */
export function formatReviewCount(count: number): string {
  return pluralize(count, "отзыв", "отзыва", "отзывов");
}
