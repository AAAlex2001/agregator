"use client";

import { useRouter } from "next/navigation";
import type { ResponseTab } from "@/entities/response";
import { useUser } from "@/entities/user";
import { Responses } from "@/widgets/orders";

/** Вкладка откликов из адреса страницы. */
interface ResponsesPageContentProps {
  initialTab: ResponseTab;
}

/** Показывает отклики исполнителю или заказчику и открывает чат по отклику. */
export function ResponsesPageContent({ initialTab }: ResponsesPageContentProps) {
  const router = useRouter();
  const { role } = useUser();

  /** Переходит в переписку по заказу. */
  function openChat(chatUuid: string) {
    router.push(`/chat/${chatUuid}`);
  }

  if (role !== "EXPERT" && role !== "CUSTOMER") {
    return null;
  }

  return (
    <Responses
      key={role}
      viewer={role}
      initialTab={initialTab}
      onOpenChat={openChat}
    />
  );
}
