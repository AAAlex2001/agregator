import type { ResponseCardData } from "@/source/entities/response";
import { RejectResponseModal } from "./RejectResponseModal";

interface Props {
  response: ResponseCardData | null;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

export function RejectResponseModalContainer({
  response,
  isLoading,
  onCancel,
  onConfirm,
}: Props) {
  if (!response) return null;

  return (
    <RejectResponseModal
      orderTitle={response.orderTitle}
      expertName={response.expertName}
      isLoading={isLoading}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
