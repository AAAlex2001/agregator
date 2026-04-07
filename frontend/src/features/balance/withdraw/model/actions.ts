import { parseRubToKopecks } from "@/shared/lib/formatMoney";
import { withdrawFunds } from "./api";
import { fetchPaymentHistory } from "@/features/balance/topup/model/api";
import type { PaymentItem } from "@/features/balance/topup/model/types";

export async function handleWithdraw(
  amount: string,
  card: string,
  onSuccess: (newBalance: number, payments: PaymentItem[]) => void,
  onError: (message: string) => void,
): Promise<void> {
  const kopecks = parseRubToKopecks(amount);
  if (!kopecks) {
    onError("Введите корректную сумму");
    return;
  }

  const digits = card.replace(/\s/g, "");
  if (!digits || digits.length < 13 || digits.length > 19) {
    onError("Введите корректный номер карты");
    return;
  }

  try {
    const result = await withdrawFunds(kopecks, digits);
    const payments = await fetchPaymentHistory();
    onSuccess(result.new_balance, payments);
  } catch (err) {
    onError(err instanceof Error ? err.message : "Ошибка вывода средств");
  }
}
