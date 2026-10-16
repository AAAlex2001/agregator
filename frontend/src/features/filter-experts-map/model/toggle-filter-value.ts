/** Переключает одно значение фильтра, сохраняя порядок остальных выбранных значений. */
export function toggleFilterValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((selectedValue) => selectedValue !== value)
    : [...values, value];
}
