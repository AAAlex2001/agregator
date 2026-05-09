"use client";

import type { KeyboardEvent, ReactNode } from "react";
import Loader from "@/source/shared/ui/Loader";
import { ChatSendIcon } from "@/source/shared/ui/icons";
import s from "./MessageComposer.module.scss";

interface MessageComposerProps {
  value: string;
  onChange: (next: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  disabledText?: string;
  sending?: boolean;
  /** Если false — кнопка отправки заблокирована даже когда текст не пустой. */
  canSend?: boolean;
  multiline?: boolean;
  /** Блок над `.bar` — превью файлов, прогресс загрузки, текст ошибки. */
  extras?: ReactNode;
  /** Кнопки/инпуты справа от поля ввода внутри `.bar` (например, скрепка для файлов). */
  affix?: ReactNode;
}

const DEFAULT_BLOCKED_TEXT = "Отправка недоступна";

export function MessageComposer(props: MessageComposerProps) {
  const {
    value,
    onChange,
    onSend,
    placeholder = "Сообщение...",
    disabled = false,
    disabledText = DEFAULT_BLOCKED_TEXT,
    sending = false,
    canSend,
    multiline = false,
    extras,
    affix,
  } = props;

  if (disabled) {
    return (
      <div className={s.wrap}>
        <div className={`${s.bar} ${s.barBlocked}`}>
          <p className={s.blockedText}>{disabledText}</p>
        </div>
      </div>
    );
  }

  const sendEnabled = (canSend ?? value.trim().length > 0) && !sending;

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (sendEnabled) onSend();
    }
  }

  return (
    <div className={s.wrap}>
      {extras}

      <div className={s.bar}>
        <div className={s.inputWrap}>
          {multiline ? (
            <textarea
              className={s.input}
              placeholder={placeholder}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              rows={1}
            />
          ) : (
            <input
              className={s.input}
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
            />
          )}
          {affix}
        </div>

        <button
          type="button"
          className={s.send}
          onClick={onSend}
          disabled={!sendEnabled}
          aria-label="Отправить"
        >
          {sending ? <Loader size="sm" label="" /> : <ChatSendIcon />}
        </button>
      </div>
    </div>
  );
}
