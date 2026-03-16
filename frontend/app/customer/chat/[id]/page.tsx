"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowIcon, ChatCheckReadIcon, ChatCheckSentIcon, ChatChevronDownIcon, ChatClipIcon, ChatSearchIcon, ChatSendIcon, ProfileIcon } from "@/app/icons";
import AuthHeader from "@/app/landing/header/AuthHeader";
import Button from "@/app/components/Button/Button";
import Loader from "@/app/components/Loader";
import {
  buildChatWebSocketUrl,
  fetchChatDetail,
  fetchChats,
  markChatMessagesRead,
  sendChatMessage,
  type ChatDetailResponse,
  type ChatListItem,
  type ChatMessage,
} from "@/app/utils/chatApi";
import { useUserProfile } from "@/app/hooks/useUserProfile";
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
  const { id: chatUuid } = useParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useUserProfile();
  const currentUserId = profile?.id ?? 0;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [chat, setChat] = useState<ChatDetailResponse | null>(null);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const threadRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredChats = useMemo(
    () => chats.filter((item) => item.counterpart_name.toLowerCase().includes(search.toLowerCase())),
    [chats, search],
  );

  useEffect(() => {
    if (!chatUuid) return;

    let cancelled = false;

    const load = async () => {
      try {
        const [detail, listResponse] = await Promise.all([
          fetchChatDetail(chatUuid),
          fetchChats(),
        ]);

        if (cancelled) return;
        setChat(detail);
        setMessages(detail.messages);
        setChats(listResponse.items);
      } catch {
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [chatUuid]);

  useEffect(() => {
    if (!chat || currentUserId <= 0) return;

    const activeChatUuid = chat.uuid;
    const wsUrl = buildChatWebSocketUrl(activeChatUuid);
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    function connect() {
      if (disposed) return;
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        void markChatMessagesRead(activeChatUuid).catch(() => undefined);
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as { event?: string; data?: unknown };
          if (payload.event === "chat_message" && payload.data) {
            const msg = payload.data as ChatMessage;
            setMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) {
                return prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m));
              }
              return [...prev, msg];
            });
            if (msg.sender_id !== currentUserId) {
              void markChatMessagesRead(activeChatUuid).catch(() => undefined);
            }
          } else if (payload.event === "messages_read" && payload.data) {
            const readIds = new Set<number>((payload.data as { message_ids: number[] }).message_ids ?? []);
            if (readIds.size > 0) {
              setMessages((prev) => prev.map((m) => (readIds.has(m.id) ? { ...m, is_read: true } : m)));
            }
          }
        } catch {
          /* ignore malformed frames */
        }
      };

      socket.onclose = () => {
        if (!disposed) reconnectTimer = setTimeout(connect, 3000);
      };

      socket.onerror = () => socket?.close();
    }

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [chat, currentUserId]);

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
    if (!text && !pendingFile) return;
    if (!chat || sending) return;
    setInputValue("");
    const fileToSend = pendingFile;
    setPendingFile(null);
    setSending(true);
    setUploadProgress(0);
    try {
      const saved = await sendChatMessage(chat.uuid, text, fileToSend, (pct) => setUploadProgress(pct));
      setMessages((prev) => (prev.some((m) => m.id === saved.id) ? prev : [...prev, saved]));
    } catch {
    } finally {
      setSending(false);
      setUploadProgress(0);
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
              const isActive = item.uuid === chatUuid;
              const isMine = item.last_message_sender_id === currentUserId;

              return (
                <Link
                  key={item.id}
                  href={`${ROUTE_BASE}/${item.uuid}`}
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
            <div className={styles.backBtnWrap}>
              <Button
                variant="outline"
                className={styles.backBtn}
                aria-label="Назад"
                onClick={() => router.push(ROUTE_BASE)}
              >
                <ArrowIcon color="currentColor" />
              </Button>
            </div>

            <div className={styles.orderInfo}>
              <button
                type="button"
                className={styles.orderTitleRow}
                aria-label={isOrderOpen ? "Свернуть" : "Развернуть"}
                aria-expanded={isOrderOpen}
                onClick={() => setIsOrderOpen((prev) => !prev)}
              >
                <p className={styles.orderTitle}>{chat?.order_title ?? ""}</p>
                <ChatChevronDownIcon className={`${styles.chevronIcon} ${isOrderOpen ? styles.chevronIconOpen : ""}`} />
              </button>
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
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <Loader size="lg" label="" />
              </div>
            ) : (
              <>
            <div className={styles.dateSeparator}>
              <div className={styles.datePill}><span>Сегодня</span></div>
            </div>

            {(() => {
              // Group consecutive messages from the same sender
              const groups: { senderId: number; senderRole: string; messages: ChatMessage[] }[] = [];
              for (const msg of messages) {
                const last = groups[groups.length - 1];
                if (last && last.senderId === msg.sender_id) {
                  last.messages.push(msg);
                } else {
                  groups.push({ senderId: msg.sender_id, senderRole: msg.sender_role, messages: [msg] });
                }
              }
              return groups.map((group, gi) => {
                const isMine = group.senderId === currentUserId;
                const senderLabel = group.senderRole === "CUSTOMER" ? "Заказчик" : "Эксперт";
                return (
                  <div key={gi} className={isMine ? styles.msgGroupSent : styles.msgGroupReceived}>
                    <span className={`${styles.senderLabel} ${isMine ? styles.alignRight : ""}`}>{senderLabel}</span>
                    {group.messages.map((message, mi) => {
                      const isLast = mi === group.messages.length - 1;
                      return !isMine ? (
                        <div key={message.id} className={styles.msgRowReceived}>
                          {isLast ? (
                            <ChatAvatar src={chat?.counterpart_avatar_url ?? ""} alt="Аватар собеседника" />
                          ) : (
                            <div className={styles.msgAvatarSpacer} />
                          )}
                          <div className={`${styles.bubble} ${styles.bubbleReceived}`}>
                            {message.text && <span className={styles.bubbleText}>{message.text}</span>}
                            {message.file_url && (
                              <a href={message.file_url} target="_blank" rel="noreferrer" className={styles.bubbleFile} download={message.file_name || undefined}>
                                📎 {message.file_name || "Файл"}
                              </a>
                            )}
                            <span className={styles.bubbleMeta}>
                              <span className={styles.bubbleTime}>{formatMessageTime(message.created_at)}</span>
                              {message.is_read ? (
                                <ChatCheckReadIcon className={styles.checkIcon} />
                              ) : (
                                <ChatCheckSentIcon className={styles.checkIcon} />
                              )}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div key={message.id} className={styles.msgRowSent}>
                          <div className={`${styles.bubble} ${styles.bubbleSent}`}>
                            {message.text && <span className={styles.bubbleText}>{message.text}</span>}
                            {message.file_url && (
                              <a href={message.file_url} target="_blank" rel="noreferrer" className={styles.bubbleFile} download={message.file_name || undefined}>
                                📎 {message.file_name || "Файл"}
                              </a>
                            )}
                            <span className={styles.bubbleMeta}>
                              <span className={styles.bubbleTime}>{formatMessageTime(message.created_at)}</span>
                              {message.is_read ? (
                                <ChatCheckReadIcon className={styles.checkIcon} />
                              ) : (
                                <ChatCheckSentIcon className={styles.checkIcon} />
                              )}
                            </span>
                          </div>
                          {isLast ? (
                            <ChatAvatar src="" alt="Ваш аватар" />
                          ) : (
                            <div className={styles.msgAvatarSpacer} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              });
            })()}
              </>
            )}
          </div>

          <div className={styles.inputBar}>
            {sending && (
              <div className={styles.uploadProgress}>
                <div className={styles.uploadProgressBar} style={{ width: `${uploadProgress}%` }} />
                <span className={styles.uploadProgressText}>{uploadProgress}%</span>
              </div>
            )}
            {pendingFile && !sending && (
              <div className={styles.filePending}>
                <span className={styles.filePendingName}>📎 {pendingFile.name}</span>
                <button type="button" className={styles.filePendingRemove} onClick={() => setPendingFile(null)}>×</button>
              </div>
            )}
            <div className={styles.inputWrap}>
              <input
                className={styles.messageInput}
                type="text"
                placeholder="Сообщение..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
              />
              <Button
                variant="transparent"
                className={styles.clipBtn}
                aria-label="Прикрепить файл"
                onClick={() => fileInputRef.current?.click()}
                disabled={sending}
              >
                <ChatClipIcon />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx"
                style={{ display: "none" }}
                tabIndex={-1}
                onChange={(e) => {
                  const f = e.currentTarget.files?.[0] ?? null;
                  if (f) setPendingFile(f);
                  e.currentTarget.value = "";
                }}
              />
            </div>
            <Button
              variant="primary"
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={sending || (!inputValue.trim() && !pendingFile)}
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
