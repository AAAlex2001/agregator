"use client";

import { ChatSearchIcon } from "@/shared/ui/icons";
import styles from "./chat-search-input.module.scss";

interface ChatSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ChatSearchInput({ value, onChange, placeholder = "Поиск по чатам" }: ChatSearchInputProps) {
  return (
    <div className={styles.wrap}>
      <ChatSearchIcon className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
