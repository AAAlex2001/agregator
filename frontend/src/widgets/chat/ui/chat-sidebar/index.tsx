"use client";

import { useState } from "react";
import { useChatList } from "@/entities/chat";
import { Title } from "@/shared/ui/title";
import { ChatList } from "../chat-list";
import { ChatSearchInput } from "../chat-search-input";
import styles from "./style.module.scss";

/** Заголовок, поиск и список диалогов кабинета. */
export function ChatSidebar() {
  const { isLoading } = useChatList();
  const [query, setQuery] = useState("");

  return (
    <aside
      className={styles.sidebar}
      aria-label="Список диалогов"
      aria-busy={isLoading}
    >
      <Title
        text="Сообщения"
        as="h1"
        className={styles.title}
      />
      <ChatSearchInput
        value={query}
        onChange={setQuery}
      />
      <ChatList query={query} />
    </aside>
  );
}
