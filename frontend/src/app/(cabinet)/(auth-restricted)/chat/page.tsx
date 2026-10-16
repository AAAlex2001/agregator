import { EmptyState } from "@/shared/ui/empty-state";
import { TabChatIcon } from "@/shared/ui/icons";

/** Пока диалог не выбран, на месте переписки — подсказка. */
export default function ChatPage() {
  return (
    <EmptyState
      icon={<TabChatIcon />}
      title="Выберите диалог"
      subtitle="Переписка откроется здесь. Выберите диалог в списке сообщений."
    />
  );
}
