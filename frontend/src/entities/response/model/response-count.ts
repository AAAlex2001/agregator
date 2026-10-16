/** Подбирает подпись количества откликов. */
export function formatResponseCount(count: number): string {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${count} откликов`;
  }

  if (lastDigit === 1) {
    return `${count} отклик`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} отклика`;
  }

  return `${count} откликов`;
}
