import type { ChatListItem } from "@/shared/lib/chatApi";

export function filterChats(chats: ChatListItem[], search: string) {
  const q = search.toLowerCase();
  return chats.filter((c) => c.counterpart_name.toLowerCase().includes(q));
}
