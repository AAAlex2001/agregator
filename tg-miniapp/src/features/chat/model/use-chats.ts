import { useEffect, useState } from "react";
import { listChats, type ChatListItem } from "@/entites/chat";

export function useChats(pollMs = 30000) {
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
    void reload();
    const id = setInterval(() => void reload(), pollMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollMs]);

  const unread = (chats ?? []).reduce((sum, chat) => sum + chat.unread_count, 0);

  return { chats, unread, reload };
}
