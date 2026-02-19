"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowIcon, ChatChevronDownIcon, ChatClipIcon, ChatSendIcon, ProfileIcon } from "@/app/icons";
import AuthHeader from "@/app/landing/header/AuthHeader";
import Button from "@/app/components/Button/Button";
import styles from "./chatWindow.module.scss";

function ChatAvatar({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className={styles.msgAvatar} aria-label={alt}>
      {!broken ? (
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

// ─── Mock data ───────────────────────────────────────────────────────
const MOCK_CHAT_DATA: Record<string, {
  name: string;
  orderTitle: string;
  customer: string;
  customerAvatar: string;
  expertAvatar: string;
  date: string;
  badges: { label: string; color: "blue" | "green" }[];
  sum: string;
  messages: { id: number; from: "customer" | "expert"; text: string; time: string }[];
}> = {
  "1": {
    name: "ООО «СпецЭнергоМонтаж»",
    orderTitle: "Промышленный экологический контроль оборудования на предприятии",
    customer: "ООО «СпецЭнергоМонтаж»",
    customerAvatar: "/industry_1.jpg",
    expertAvatar: "/industry_2.jpg",
    date: "18.02.2026",
    badges: [
      { label: "Э4 ТУ", color: "blue" },
      { label: "Э4 ОБ", color: "green" },
    ],
    sum: "50 000 ₽",
    messages: [
      { id: 1, from: "customer", text: "Доброе утро, Сергей!", time: "09:00" },
      { id: 2, from: "customer", text: "Могли бы Вы приложить документы к Вашему предложению?", time: "09:00" },
      { id: 3, from: "expert", text: "Доброе утро!", time: "09:15" },
      { id: 4, from: "customer", text: "Позже скажем Вам о решении", time: "09:21" },
    ],
  },
  "2": {
    name: "АО «ТехноПромСервис»",
    orderTitle: "Техническое диагностирование трубопровода пара и горячей воды",
    customer: "АО «ТехноПромСервис»",
    customerAvatar: "/industry_3.jpg",
    expertAvatar: "/industry_4.jpg",
    date: "05.10.2025",
    badges: [{ label: "Э4 ТУ", color: "blue" }],
    sum: "30 000 ₽",
    messages: [
      { id: 1, from: "customer", text: "Добрый день! Нам нужна Ваша помощь.", time: "10:00" },
      { id: 2, from: "expert", text: "Здравствуйте! Рад помочь.", time: "10:05" },
    ],
  },
};

const DEFAULT_CHAT = MOCK_CHAT_DATA["1"];

// ─── Component ───────────────────────────────────────────────────────
export default function ChatWindowPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const chat = MOCK_CHAT_DATA[id] ?? DEFAULT_CHAT;

  const [messages, setMessages] = useState(chat.messages);
  const [inputValue, setInputValue] = useState("");
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setMessages((prev) => [...prev, { id: Date.now(), from: "expert", text, time }]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AuthHeader />
      <main className={styles.body}>
        <div className={styles.card}>
          {/* Order Nav */}
          <div className={styles.orderNav}>
            {/* Back button */}
            <Button
              variant="outline"
              className={styles.backBtn}
              aria-label="Назад"
              onClick={() => router.push("/chat")}
            >
              <ArrowIcon color="currentColor" />
            </Button>

            {/* Order info */}
            <div className={styles.orderInfo}>
              {/* Title row with collapse chevron */}
              <Button
                variant="transparent"
                className={styles.orderTitleRow}
                aria-label={isOrderOpen ? "Свернуть" : "Развернуть"}
                aria-expanded={isOrderOpen}
                onClick={() => setIsOrderOpen((prev) => !prev)}
              >
                <p className={styles.orderTitle}>{chat.orderTitle}</p>
                <ChatChevronDownIcon className={`${styles.chevronIcon} ${isOrderOpen ? styles.chevronIconOpen : ""}`} />
              </Button>
              <div className={`${styles.orderDetails} ${isOrderOpen ? styles.orderDetailsOpen : ""}`}>
                <p className={styles.orderCustomer}>{chat.customer}</p>
                <div className={styles.orderMeta}>
                  <span className={styles.orderDate}>{chat.date}</span>
                  <div className={styles.orderBadges}>
                    {chat.badges.map((b) => (
                      <span key={b.label} className={b.color === "blue" ? styles.badgeBlue : styles.badgeGreen}>
                        <span>{b.label}</span>
                      </span>
                    ))}
                  </div>
                  <span className={styles.orderSum}>{chat.sum}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Thread */}
          <div className={styles.thread} ref={threadRef}>
            {/* Date separator */}
            <div className={styles.dateSeparator}>
              <div className={styles.datePill}><span>Сегодня</span></div>
            </div>

            {/* Messages */}
            {messages.map((msg) =>
              msg.from === "customer" ? (
                <div key={msg.id} className={styles.msgGroupReceived}>
                  <span className={styles.senderLabel}>Заказчик</span>
                  <div className={styles.msgRowReceived}>
                    <ChatAvatar src={chat.customerAvatar} alt="Аватар заказчика" />
                    <div className={`${styles.bubble} ${styles.bubbleReceived}`}>
                      <span className={styles.bubbleText}>{msg.text}</span>
                      <span className={styles.bubbleTime}>{msg.time}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className={styles.msgGroupSent}>
                  <span className={`${styles.senderLabel} ${styles.alignRight}`}>Эксперт</span>
                  <div className={styles.msgRowSent}>
                    <div className={`${styles.bubble} ${styles.bubbleSent}`}>
                      <span className={styles.bubbleText}>{msg.text}</span>
                      <span className={styles.bubbleTime}>{msg.time}</span>
                    </div>
                    <ChatAvatar src={chat.expertAvatar} alt="Аватар эксперта" />
                  </div>
                </div>
              )
            )}
          </div>

          {/* Input Bar */}
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
              onClick={handleSend}
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
