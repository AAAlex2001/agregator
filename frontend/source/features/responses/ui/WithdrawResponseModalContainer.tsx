import type { ResponseCardData } from "@/source/entities/response";
import { WithdrawResponseModal } from "./WithdrawResponseModal";

interface WithdrawResponseModalContainerProps {
  response: ResponseCardData | null;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function WithdrawResponseModalContainer({
  response,
  isLoading,
  onCancel,
  onConfirm,
}: WithdrawResponseModalContainerProps) {
  if (!response) {
    return null;
  }

  const hasCommission = Boolean(
    response.commissionAmount
    && response.commissionAmount !== "0 ₽"
    && response.commissionAmount !== "0 ₽",
  );

  const warnings = response.balanceReturnAmount
    ? [
      "Заказчик больше не увидит ваше предложение",
      "Вы сможете откликнуться на этот заказ повторно",
    ]
    : hasCommission
      ? [
        "Взнос за участие в тендере не возвращается",
        "Заказчик больше не увидит ваше предложение",
        "Вы сможете откликнуться на этот заказ повторно",
      ]
      : [
        "Заказчик больше не увидит ваше предложение",
        "Вы сможете откликнуться на этот заказ повторно",
      ];

  return (
    <WithdrawResponseModal
      dateLabel={response.dateLabel}
      date={response.date}
      status={response.status}
      statusColor={response.statusColor}
      statusBg={response.statusBg}
      orderTitle={response.orderTitle}
      customer={response.customer}
      orderDate={response.orderDate}
      badges={response.badges}
      sum={response.orderSum || response.sum}
      balanceReturnAmount={response.balanceReturnAmount}
      warnings={warnings}
      isLoading={isLoading}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}