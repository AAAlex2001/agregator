import type { ResponseCardData } from "@/source/entities/response";
import { WithdrawResponseModal } from "./WithdrawResponseModal";

interface WithdrawResponseModalContainerProps {
  response: ResponseCardData | null;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const WARNINGS = [
  "Заказчик больше не увидит ваше предложение",
  "Вы сможете откликнуться на этот заказ повторно",
];

export function WithdrawResponseModalContainer({
  response,
  isLoading,
  onCancel,
  onConfirm,
}: WithdrawResponseModalContainerProps) {
  if (!response) {
    return null;
  }

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
      warnings={WARNINGS}
      isLoading={isLoading}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
