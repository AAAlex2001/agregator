import { formatDayRu } from "@/shared/lib/format";
import type { ChatMessage } from "@/entites/chat";

export interface ChatDayGroup {
  day: string;
  items: ChatMessage[];
}

export function groupMessagesByDay(messages: ChatMessage[]): ChatDayGroup[] {
  const groups: ChatDayGroup[] = [];
  for (const message of messages) {
    const day = formatDayRu(message.created_at);
    const last = groups[groups.length - 1];
    if (last && last.day === day) {
      last.items.push(message);
    } else {
      groups.push({ day, items: [message] });
    }
  }
  return groups;
}
