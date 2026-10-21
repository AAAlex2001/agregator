"use client";

import { useRouter } from "next/navigation";
import { EditResponse } from "@/widgets/orders";

/** Отклик, условия которого меняет исполнитель. */
interface EditResponsePageContentProps {
  responseId: number;
}

/** Возвращает исполнителя к своим откликам после сохранения или отмены. */
export function EditResponsePageContent({ responseId }: EditResponsePageContentProps) {
  const router = useRouter();

  /** Открывает свои отклики. */
  function returnToResponses() {
    router.push("/responses");
  }

  return (
    <EditResponse
      responseId={responseId}
      onCancel={returnToResponses}
      onSaved={returnToResponses}
    />
  );
}
