import type { ChatMessageData } from "./types";
import type { ChatMessageGroupData } from "../ui/MessageGroup";

export function groupChatMessages(messages: ChatMessageData[]): ChatMessageGroupData[] {
  const groups: ChatMessageGroupData[] = [];

  for (const message of messages) {
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.senderId === message.sender_id) {
      lastGroup.messages.push(message);
    } else {
      groups.push({
        senderId: message.sender_id,
        senderRole: message.sender_role,
        messages: [message],
      });
    }
  }

  return groups;
}
