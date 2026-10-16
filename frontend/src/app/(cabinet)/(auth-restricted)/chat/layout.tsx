import type { ReactNode } from "react";
import { ChatLayout } from "@/widgets/chat";

/** Открытая переписка или подсказка выбрать диалог. */
interface ChatSectionLayoutProps {
  children: ReactNode;
}

/** Держит список диалогов рядом с перепиской при переходах между чатами. */
export default function ChatSectionLayout({ children }: ChatSectionLayoutProps) {
  return <ChatLayout>{children}</ChatLayout>;
}
