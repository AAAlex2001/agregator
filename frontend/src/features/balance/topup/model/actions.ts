import { parseRubToKopecks } from "@/shared/lib/formatMoney";
import { createPayment } from "./api";

export async function handleDeposit(
  amount: string,
  returnUrl: string,
  onSuccess: (url: string) => void,
  onError: (message: string) => void,
): Promise<void> {
  const kopecks = parseRubToKopecks(amount);
  if (!kopecks) {
    onError("Введите корректную сумму");
    return;
  }

  try {
    const { confirmation_url } = await createPayment(kopecks, returnUrl);
    onSuccess(confirmation_url);
  } catch (err) {
    onError(err instanceof Error ? err.message : "Ошибка создания платежа");
  }
}
