import type { ChatMessage } from "@/shared/lib/chatApi";
import type { MessageGroupData } from "@/entities/chat/ui/MessageGroup";

export function groupMessages(messages: ChatMessage[]): MessageGroupData[] {
  const groups: MessageGroupData[] = [];
  for (const msg of messages) {
    const last = groups[groups.length - 1];
    if (last && last.senderId === msg.sender_id) {
      last.messages.push(msg);
    } else {
      groups.push({ senderId: msg.sender_id, senderRole: msg.sender_role, messages: [msg] });
    }
  }
  return groups;
}
