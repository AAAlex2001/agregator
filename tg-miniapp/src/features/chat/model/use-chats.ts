import { useEffect, useState } from "react";
import { listChats, type ChatListItem } from "@/entites/chat";

export function useChats(active = true) {
  const [chats, setChats] = useState<ChatListItem[] | null>(null);

  const reload = async () => {
    try {
      const data = await listChats();
      setChats(data.items);
    } catch {
      setChats((prev) => prev ?? []);
    }
  };

  useEffect(() => {
    if (active) void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const unread = (chats ?? []).reduce((sum, chat) => sum + chat.unread_count, 0);

  return { chats, unread, reload };
}
