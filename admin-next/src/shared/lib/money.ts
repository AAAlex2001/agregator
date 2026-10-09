const RUB_FORMAT = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

/** Сумма в рублях в виде «12 500 ₽». */
export const formatRub = (rubles: number) => RUB_FORMAT.format(rubles);

/** Размер файла в виде «1,2 МБ» или «640 КБ». */
export const formatFileSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} МБ` : `${Math.round(bytes / 1024)} КБ`;
