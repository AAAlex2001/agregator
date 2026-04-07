"use client";

import { useEffect, useState } from "react";
import AuthHeader from "@/widgets/header/AuthHeader";
import { Subtitle } from "@/shared/ui/Typography";
import Loader from "@/shared/ui/Loader";
import { ChatSearchInput } from "@/shared/ui/ChatSearchInput";
import { ChatListItem } from "@/entities/chat/ui/ChatListItem";
import { fetchChats, type ChatListItem as ChatListItemModel } from "@/shared/lib/chatApi";
import styles from "./chat-list.module.scss";

export default function ChatList({ routeBase }: { routeBase: string }) {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState<ChatListItemModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetchChats();
        if (!cancelled) setChats(response.items);
      } catch {
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const q = search.toLowerCase();
  const filtered = chats.filter((chat) => chat.counterpart_name.toLowerCase().includes(q));

  return (
    <>
      <AuthHeader />
      <main className={styles.body}>
        <div className={styles.card}>
          <ChatSearchInput value={search} onChange={setSearch} placeholder="Поиск по чатам" />

          <div className={styles.list}>
            {loading ? (
              <div className={styles.loader}>
                <Loader size="md" label="" />
              </div>
            ) : filtered.length === 0 ? (
              <p className={styles.empty}>Нет чатов</p>
            ) : (
              filtered.map((chat) => (
                <ChatListItem key={chat.id} chat={chat} href={`${routeBase}/${chat.uuid}`} />
              ))
            )}
          </div>
        </div>

        <section className={styles.desktopEmptyState} aria-label="Пустое состояние чата">
          <Subtitle
            text="Выберите кому написать в левой панели чатов"
            className={styles.emptyStateText}
          />
        </section>
      </main>
    </>
  );
}
