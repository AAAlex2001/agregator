import type { ExpertRoomMessageData, ExpertRoomMessageGroup } from "./types";

export function groupExpertRoomMessages(messages: ExpertRoomMessageData[]): ExpertRoomMessageGroup[] {
  const groups: ExpertRoomMessageGroup[] = [];

  for (const message of messages) {
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.senderId === message.sender_id) {
      lastGroup.messages.push(message);
    } else {
      groups.push({
        senderId: message.sender_id,
        senderName: message.sender_name,
        senderAvatarUrl: message.sender_avatar_url,
        messages: [message],
      });
    }
  }

  return groups;
}
