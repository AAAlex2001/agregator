"use client";

import { useState } from "react";
import Link from "next/link";
import AuthHeader from "@/app/landing/header/AuthHeader";
import { ChatSearchIcon, ProfileIcon } from "@/app/icons";
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

const MOCK_CHATS = [
  {
    id: "1",
    name: "ООО «СпецЭнергоМонтаж»",
    avatarUrl: "/industry_1.jpg",
    time: "9:23",
    lastMsg: "Ждём Вас завтра",
    unread: 3,
    active: false,
    isMine: false,
  },
  {
    id: "2",
    name: "АО «ТехноПромСервис»",
    avatarUrl: "/industry_3.jpg",
    time: "05.10",
    lastMsg: "Позже скажем Вам о решении",
    unread: 0,
    active: true,
    isMine: false,
  },
  {
    id: "3",
    name: "ИП Смирнов Д.А.",
    avatarUrl: "",
    time: "8:56",
    lastMsg: "Сейчас найду файл и отправлю Вам",
    unread: 0,
    active: false,
    isMine: true,
  },
  {
    id: "4",
    name: "ООО «НефтеХимСтрой»",
    avatarUrl: "",
    time: "05.10",
    lastMsg: "Нам нужна лаборатория для проверки",
    unread: 0,
    active: false,
    isMine: false,
  },
  {
    id: "5",
    name: "ЗАО «ПромБезопасность»",
    avatarUrl: "",
    time: "05.10",
    lastMsg: "Нам нужна лаборатория для проверки",
    unread: 0,
    active: false,
    isMine: false,
  },
  {
    id: "6",
    name: "ООО «ГазТрансСервис»",
    avatarUrl: "",
    time: "05.10",
    lastMsg: "Нам нужна лаборатория для проверки",
    unread: 0,
    active: false,
    isMine: false,
  },
  {
    id: "7",
    name: "АО «УралЭнергоРесурс»",
    avatarUrl: "",
    time: "05.10",
    lastMsg: "Нам нужна лаборатория для проверки",
    unread: 0,
    active: false,
    isMine: false,
  },
  {
    id: "8",
    name: "ООО «СибирьХимМаш»",
    avatarUrl: "",
    time: "05.10",
    lastMsg: "Нам нужна лаборатория для проверки",
    unread: 0,
    active: false,
    isMine: false,
  },
];

export default function ChatListPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_CHATS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
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
                href={`/chat/${chat.id}`}
                className={`${styles.chatItem} ${chat.active ? styles.chatItemActive : ""}`}
              >
                {/* Avatar */}
                <ChatListAvatar avatarUrl={chat.avatarUrl} alt={`Аватар ${chat.name}`} />

                {/* Content */}
                <div className={styles.chatContent}>
                  <div className={styles.chatTitleRow}>
                    <span className={styles.chatName}>{chat.name}</span>
                    <span className={styles.chatTime}>{chat.time}</span>
                  </div>
                  <div className={styles.chatMessageRow}>
                    <span className={styles.chatLastMsg}>
                      {chat.isMine && (
                        <span className={styles.chatLastMsgPrefix}>Вы: </span>
                      )}
                      {chat.lastMsg}
                    </span>
                    {chat.unread > 0 && (
                      <span className={styles.unreadBadge}>
                        <span>{chat.unread}</span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
