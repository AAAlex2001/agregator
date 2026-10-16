import type { ChangeEvent } from "react";
import { ChatSearchIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Текст поиска и его изменение. */
interface ChatSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

/** Поле поиска по собеседникам и сообщениям. */
export function ChatSearchInput({ value, onChange }: ChatSearchInputProps) {
  /** Передаёт введённый текст. */
  function changeValue(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <div className={styles.wrap}>
      <ChatSearchIcon className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        placeholder="Поиск по сообщениям"
        aria-label="Поиск по сообщениям"
        value={value}
        onChange={changeValue}
      />
    </div>
  );
}
