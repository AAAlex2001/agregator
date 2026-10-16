"use client";

import { useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import type { ChatMessageData } from "@/entities/chat";
import { FileGallery } from "@/shared/ui/file-gallery";
import { ChatClipIcon, ChatSendIcon } from "@/shared/ui/icons";
import { Loader } from "@/shared/ui/loader";
import { ProgressBar } from "@/shared/ui/progress-bar";
import { CHAT_FILES_ACCEPT } from "../../config/files";
import { useSendChatMessage } from "../../model/use-send-chat-message";
import styles from "./style.module.scss";

/** Переписка, её блокировка и действие после отправки сообщения. */
interface ChatComposerProps {
  chatUuid: string;
  isBlocked: boolean;
  blockedText: string;
  onSent: (message: ChatMessageData) => void;
}

/** Поле сообщения со скрепкой и кнопкой отправки; в закрытом чате — пояснение. */
export function ChatComposer({ chatUuid, isBlocked, blockedText, onSent }: ChatComposerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const composer = useSendChatMessage(chatUuid, onSent);
  const { isSending, progress, text } = composer.state;
  const hasFiles = composer.items.length > 0;

  /** Открывает системный выбор файлов. */
  function openFilePicker() {
    inputRef.current?.click();
  }

  /** Прикладывает выбранные файлы и позволяет выбрать удалённый файл снова. */
  function changeFiles(event: ChangeEvent<HTMLInputElement>) {
    composer.addFiles(event.target.files);
    event.target.value = "";
  }

  /** Обновляет текст по мере ввода. */
  function changeText(event: ChangeEvent<HTMLInputElement>) {
    composer.changeText(event.target.value);
  }

  /** Отправляет сообщение по Enter. */
  function sendOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void composer.send();
    }
  }

  if (isBlocked) {
    return (
      <div className={styles.wrap}>
        <div className={styles.blockedBar}>
          <p className={styles.blockedText}>{blockedText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {isSending && hasFiles && <ProgressBar percent={progress} />}
      {!isSending && hasFiles && (
        <FileGallery
          items={composer.items}
          variant="editable"
          blockClassName={styles.files}
          hint="До 6 файлов: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX"
          hintClassName={styles.hint}
        />
      )}

      <div className={styles.bar}>
        <div className={styles.inputWrap}>
          <input
            className={styles.input}
            type="text"
            placeholder="Сообщение..."
            value={text}
            onChange={changeText}
            onKeyDown={sendOnEnter}
            disabled={isSending}
          />
          <button
            type="button"
            className={styles.clip}
            aria-label="Прикрепить файл"
            onClick={openFilePicker}
            disabled={isSending}
          >
            <ChatClipIcon />
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={CHAT_FILES_ACCEPT}
            multiple
            hidden
            onChange={changeFiles}
          />
        </div>

        <button
          type="button"
          className={styles.send}
          onClick={composer.send}
          disabled={!composer.canSend}
          aria-label="Отправить"
        >
          {isSending ? (
            <Loader
              size="sm"
              label=""
            />
          ) : (
            <ChatSendIcon />
          )}
        </button>
      </div>
    </div>
  );
}
