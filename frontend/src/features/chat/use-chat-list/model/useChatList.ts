"use client";

import { useEffect, useState } from "react";
import { fetchChats, type ChatListItem } from "@/shared/lib/chatApi";

export function useChatList() {
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchChats()
      .then((res) => {
        if (!cancelled) setChats(res.items);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { chats, setChats, loading };
}

export function filterChats(chats: ChatListItem[], search: string) {
  const q = search.toLowerCase();
  return chats.filter((c) => c.counterpart_name.toLowerCase().includes(q));
}
