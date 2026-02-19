"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowIcon, ChatChevronDownIcon, ChatClipIcon, ChatSearchIcon, ChatSendIcon, ProfileIcon } from "@/app/icons";
import AuthHeader from "@/app/landing/header/AuthHeader";
import Button from "@/app/components/Button/Button";
import {
  buildChatWebSocketUrl,
  fetchChatDetail,
  fetchChatPresence,
  fetchChats,
  getCurrentUserId,
  sendChatMessage,
  type ChatDetailResponse,
  type ChatListItem,
  type ChatMessage,
} from "@/app/utils/chatApi";
import styles from "./chatWindow.module.scss";

const ROUTE_BASE = "/customer/chat";

function formatListTime(value: string | null): string {
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

function formatMessageTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function ChatAvatar({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className={styles.msgAvatar} aria-label={alt}>
      {!broken && src ? (
        <img
          src={src}
          alt={alt}
          className={styles.msgAvatarImage}
          onError={() => setBroken(true)}
        />
      ) : (
        <ProfileIcon className={styles.msgAvatarFallback} />
      )}
    </div>
  );
}

export default function ChatWindowPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const chatId = Number(id);
  const currentUserId = getCurrentUserId();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [chat, setChat] = useState<ChatDetailResponse | null>(null);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [bothOnline, setBothOnline] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  const filteredChats = useMemo(
    () => chats.filter((item) => item.counterpart_name.toLowerCase().includes(search.toLowerCase())),
    [chats, search],
  );

  useEffect(() => {
    if (!Number.isInteger(chatId) || chatId <= 0) return;

    let cancelled = false;

    const load = async () => {
      try {
        const [detail, listResponse] = await Promise.all([
          fetchChatDetail(chatId),
          fetchChats(),
        ]);

        if (cancelled) return;
        setChat(detail);
        setMessages(detail.messages);
        setChats(listResponse.items);
      } catch {
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [chatId]);

  useEffect(() => {
    if (!Number.isInteger(chatId) || chatId <= 0) return;

    let cancelled = false;

    const pollPresence = async () => {
      try {
        const presence = await fetchChatPresence(chatId);
        if (!cancelled) {
          setBothOnline(presence.both_online);
        }
      } catch {
      }
    };

    pollPresence();
    const timer = window.setInterval(pollPresence, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [chatId]);

  useEffect(() => {
    if (!chat || !bothOnline) return;

    const socket = new WebSocket(buildChatWebSocketUrl(chat.id));

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as {
          event?: string;
          data?: ChatMessage | { both_online?: boolean };
        };

        if (payload.event === "chat_message" && payload.data) {
          const message = payload.data as ChatMessage;
          setMessages((prev) => {
            if (prev.some((item) => item.id === message.id)) return prev;
            return [...prev, message];
          });
        }

        if (payload.event === "chat_presence" && payload.data) {
          const nextPresence = payload.data as { both_online?: boolean };
          if (typeof nextPresence.both_online === "boolean") {
            setBothOnline(nextPresence.both_online);
          }
        }
      } catch {
      }
    };

    return () => {
      socket.close();
    };
  }, [bothOnline, chat]);

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || !chat) return;

    try {
      const saved = await sendChatMessage(chat.id, text);
      setMessages((prev) => {
        if (prev.some((item) => item.id === saved.id)) return prev;
        return [...prev, saved];
      });
      setInputValue("");
    } catch {
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <>
      <AuthHeader />
      <main className={styles.body}>
        <aside className={styles.desktopSidebar}>
          <div className={styles.sideSearch}>
            <ChatSearchIcon className={styles.sideSearchIcon} />
            <input
              type="text"
              className={styles.sideSearchInput}
              placeholder="Поиск по чатам"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.sideList}>
            {filteredChats.map((item) => {
              const isActive = item.id === chatId;
              const isMine = item.last_message_sender_id === currentUserId;

              return (
                <Link
                  key={item.id}
                  href={`${ROUTE_BASE}/${item.id}`}
                  className={`${styles.sideChatItem} ${isActive ? styles.sideChatItemActive : ""}`}
                >
                  <div className={styles.sideAvatar}>
                    {item.counterpart_avatar_url ? (
                      <img src={item.counterpart_avatar_url} alt={`Аватар ${item.counterpart_name}`} className={styles.sideAvatarImage} />
                    ) : (
                      <ProfileIcon className={styles.sideAvatarIcon} />
                    )}
                  </div>
                  <div className={styles.sideContent}>
                    <div className={styles.sideTitleRow}>
                      <span className={styles.sideName}>{item.counterpart_name}</span>
                      <span className={styles.sideTime}>{formatListTime(item.last_message_at)}</span>
                    </div>
                    <div className={styles.sideMsgRow}>
                      <span className={styles.sideMsg}>
                        {isMine ? <span className={styles.sideMsgPrefix}>Вы: </span> : null}
                        {item.last_message_text || "Нет сообщений"}
                      </span>
                      {item.unread_count > 0 ? <span className={styles.sideUnread}>{item.unread_count}</span> : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        <div className={styles.card}>
          <div className={styles.orderNav}>
            <Button
              variant="outline"
              className={styles.backBtn}
              aria-label="Назад"
              onClick={() => router.push(ROUTE_BASE)}
            >
              <ArrowIcon color="currentColor" />
            </Button>

            <div className={styles.orderInfo}>
              <Button
                variant="transparent"
                className={styles.orderTitleRow}
                aria-label={isOrderOpen ? "Свернуть" : "Развернуть"}
                aria-expanded={isOrderOpen}
                onClick={() => setIsOrderOpen((prev) => !prev)}
              >
                <p className={styles.orderTitle}>{chat?.order_title ?? ""}</p>
                <ChatChevronDownIcon className={`${styles.chevronIcon} ${isOrderOpen ? styles.chevronIconOpen : ""}`} />
              </Button>
              <div className={`${styles.orderDetails} ${isOrderOpen ? styles.orderDetailsOpen : ""}`}>
                <p className={styles.orderCustomer}>{chat?.order_company ?? ""}</p>
                <div className={styles.orderMeta}>
                  <span className={styles.orderDate}>{chat?.order_date ?? ""}</span>
                  <div className={styles.orderBadges}>
                    {(chat?.order_badges ?? []).map((badge) => (
                      <span key={badge.text} className={badge.variant === "BLUE" ? styles.badgeBlue : styles.badgeGreen}>
                        <span>{badge.text}</span>
                      </span>
                    ))}
                  </div>
                  <span className={styles.orderSum}>{chat?.order_sum ?? ""}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.thread} ref={threadRef}>
            <div className={styles.dateSeparator}>
              <div className={styles.datePill}><span>Сегодня</span></div>
            </div>

            {messages.map((message) => {
              const isMine = message.sender_id === currentUserId;
              const senderLabel = message.sender_role === "CUSTOMER" ? "Заказчик" : "Эксперт";

              return !isMine ? (
                <div key={message.id} className={styles.msgGroupReceived}>
                  <span className={styles.senderLabel}>{senderLabel}</span>
                  <div className={styles.msgRowReceived}>
                    <ChatAvatar src={chat?.counterpart_avatar_url ?? ""} alt="Аватар собеседника" />
                    <div className={`${styles.bubble} ${styles.bubbleReceived}`}>
                      <span className={styles.bubbleText}>{message.text}</span>
                      <span className={styles.bubbleTime}>{formatMessageTime(message.created_at)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={message.id} className={styles.msgGroupSent}>
                  <span className={`${styles.senderLabel} ${styles.alignRight}`}>{senderLabel}</span>
                  <div className={styles.msgRowSent}>
                    <div className={`${styles.bubble} ${styles.bubbleSent}`}>
                      <span className={styles.bubbleText}>{message.text}</span>
                      <span className={styles.bubbleTime}>{formatMessageTime(message.created_at)}</span>
                    </div>
                    <ChatAvatar src="" alt="Ваш аватар" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.inputBar}>
            <div className={styles.inputWrap}>
              <input
                className={styles.messageInput}
                type="text"
                placeholder="Сообщение..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button variant="transparent" className={styles.clipBtn} aria-label="Прикрепить файл">
                <ChatClipIcon />
              </Button>
            </div>
            <Button
              variant="primary"
              className={styles.sendBtn}
              onClick={() => void handleSend()}
              disabled={!inputValue.trim()}
              aria-label="Отправить"
            >
              <ChatSendIcon />
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
