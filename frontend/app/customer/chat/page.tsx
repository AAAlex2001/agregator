"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthHeader from "@/app/landing/header/AuthHeader";
import { Subtitle } from "@/app/components/Typography";
import { ChatSearchIcon, ProfileIcon } from "@/app/icons";
import { fetchChats, openChatByOrder, type ChatListItem } from "@/app/utils/chatApi";
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
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState<ChatListItem[]>([]);

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    if (!orderIdParam) return;

    const orderId = Number(orderIdParam);
    if (!Number.isInteger(orderId) || orderId <= 0) return;

    let cancelled = false;

    const run = async () => {
      try {
        const detail = await openChatByOrder(orderId);
        if (!cancelled) {
          router.replace(`/customer/chat/${detail.id}`);
        }
      } catch {
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetchChats();
        if (!cancelled) {
          setChats(response.items);
        }
      } catch {
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
            {filtered.map((chat) => (
              <Link
                key={chat.id}
                href={`/customer/chat/${chat.id}`}
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
