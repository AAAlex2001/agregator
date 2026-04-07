"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthHeader from "@/widgets/header/AuthHeader";
import { Subtitle } from "@/shared/ui/Typography";
import Loader from "@/shared/ui/Loader";
import { ChatSearchIcon, ProfileIcon } from "@/shared/ui/icons";
import { fetchChats, type ChatListItem } from "@/shared/lib/chatApi";
import styles from "./chat.module.scss";

function ChatListAvatar({ avatarUrl, alt }: { avatarUrl?: string; alt: string }) {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(avatarUrl) && !broken;

  return (
    <div className={styles.avatar}>
      {showImage ? (
        <img
          src={avatarUrl}
          alt={alt}
          className={styles.avatarImage}
          onError={() => setBroken(true)}
        />
      ) : (
        <ProfileIcon className={styles.avatarIcon} />
      )}
    </div>
  );
}

function formatChatTime(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  }

  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

export default function ChatListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState<ChatListItem[]>([]);
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

  const filtered = useMemo(
    () => chats.filter((chat) => chat.counterpart_name.toLowerCase().includes(search.toLowerCase())),
    [chats, search],
  );

  return (
    <>
      <AuthHeader />
      <main className={styles.body}>
        <div className={styles.card}>
          {/* Search */}
          <div className={styles.search}>
            <span className={styles.searchIcon}>
              <ChatSearchIcon />
            </span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск по чатам"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* List */}
          <div className={styles.listWrap}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                <Loader size="md" label="" />
              </div>
            ) : filtered.length === 0 ? (
              <p style={{ textAlign: "center", padding: "40px 20px", color: "#999" }}>Нет чатов</p>
            ) : filtered.map((chat) => (
              <Link
                key={chat.id}
                href={`/expert/chat/${chat.uuid}`}
                className={styles.chatItem}
              >
                {/* Avatar */}
                <ChatListAvatar avatarUrl={chat.counterpart_avatar_url ?? ""} alt={`Аватар ${chat.counterpart_name}`} />

                {/* Content */}
                <div className={styles.chatContent}>
                  <div className={styles.chatTitleRow}>
                    <span className={styles.chatName}>{chat.counterpart_name}</span>
                    <span className={styles.chatTime}>{formatChatTime(chat.last_message_at)}</span>
                  </div>
                  <div className={styles.chatMessageRow}>
                    <span className={styles.chatLastMsg}>{chat.last_message_text || "Нет сообщений"}</span>
                    {chat.unread_count > 0 && (
                      <span className={styles.unreadBadge}>
                        <span>{chat.unread_count}</span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
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
