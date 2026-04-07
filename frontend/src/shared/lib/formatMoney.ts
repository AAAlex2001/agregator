/** Копейки → "1 234 ₽" */
export function formatBalance(kopecks: number): string {
  return Math.floor(kopecks / 100).toLocaleString("ru-RU") + " ₽";
}

/** ISO → "07.04.26" */
export function formatPaymentDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

export interface PaymentLike {
  amount: number;
  payment_type: string;
  status: string;
}

/** Формирует читаемый текст транзакции */
export function formatTransactionText(item: PaymentLike): string {
  const rub = Math.floor(item.amount / 100).toLocaleString("ru-RU");

  const labels: Record<string, { ok: string; cancel: string; pending: string }> = {
    DEPOSIT:     { ok: `Пополнение баланса +${rub} ₽`, cancel: `Пополнение баланса ${rub} ₽ (отменено)`, pending: `Пополнение баланса ${rub} ₽ (в обработке)` },
    COMMISSION:  { ok: `Комиссия за проект −${rub} ₽`, cancel: `Комиссия за проект ${rub} ₽ (отменено)`, pending: `Комиссия за проект −${rub} ₽ (в обработке)` },
    WITHDRAWAL:  { ok: `Вывод средств −${rub} ₽`,      cancel: `Вывод средств ${rub} ₽ (отменено)`,      pending: `Вывод средств −${rub} ₽ (в обработке)` },
  };

  const group = labels[item.payment_type];
  if (group) {
    if (item.status === "SUCCEEDED") return group.ok;
    if (item.status === "CANCELED") return group.cancel;
    return group.pending;
  }

  if (item.status === "REFUNDED") return `Возврат средств +${rub} ₽`;
  return `Операция ${rub} ₽`;
}

/** Парсит рубли из строки ввода → копейки. 0 если невалидно */
export function parseRubToKopecks(raw: string): number {
  const rub = parseFloat(raw.replace(/\s/g, "").replace(",", "."));
  if (!rub || rub <= 0 || !Number.isFinite(rub)) return 0;
  return Math.round(rub * 100);
}

/** Парсит отображаемую сумму "1 234,56 ₽" → копейки. 0 если невалидно */
export function parseDisplayAmountToKopecks(value: string): number {
  const normalized = value.replace(/₽/g, "").replace(/\s/g, "").replace(",", ".").trim();
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.round(parsed * 100);
}
