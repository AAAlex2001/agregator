import { EmptyState } from "@/source/shared/ui/EmptyState";
import { TabChatIcon } from "@/source/shared/ui/icons";

export function ChatEmptyStateWidget() {
  return (
    <EmptyState
      icon={<TabChatIcon />}
      title="Выберите диалог"
      subtitle="Переписка откроется здесь. Выберите диалог в списке сообщений."
    />
  );
}
