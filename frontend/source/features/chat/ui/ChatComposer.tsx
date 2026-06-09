"use client";

import { useRef, useState } from "react";
import { MessageComposer } from "@/source/shared/ui/MessageComposer";
import { ChatClipIcon } from "@/source/shared/ui/icons";
import type { ChatMessageData } from "@/source/entities/chat";
import { sendChatMessage } from "@/source/entities/chat";
import { FilePending, UploadProgress } from "./FilePending";
import s from "./ChatComposer.module.scss";

interface ChatComposerProps {
  chatUuid: string;
  isBlocked?: boolean;
  blockedText?: string;
  onSent: (message: ChatMessageData) => void;
}

const ACCEPT = ".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx";
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const MAX_FILES = 6;
const DEFAULT_BLOCKED_TEXT = "Чат по этому заказу завершен";

export function ChatComposer({ chatUuid, isBlocked = false, blockedText = DEFAULT_BLOCKED_TEXT, onSent }: ChatComposerProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const sendingFiles = sending && files.length > 0;
  const canSend = !sending && (text.trim().length > 0 || files.length > 0);

  async function handleSend() {
    if (!canSend) return;

    setError(null);
    setSending(true);
    setProgress(0);

    try {
      const saved = await sendChatMessage(chatUuid, text.trim(), files, (percent) => setProgress(percent));
      setText("");
      setFiles([]);
      onSent(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить сообщение");
    } finally {
      setSending(false);
      setProgress(0);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (isBlocked) return;

    const nextFiles = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";

    if (!nextFiles.length) return;

    if (files.length + nextFiles.length > MAX_FILES) {
      setError(`Можно прикрепить не больше ${MAX_FILES} файлов`);
      return;
    }

    for (const nextFile of nextFiles) {
      if (nextFile.size > MAX_FILE_SIZE) {
        setError(`Файл ${nextFile.name} больше 100 МБ не поддерживается`);
        return;
      }
    }

    setError(null);
    setFiles((currentFiles) => [...currentFiles, ...nextFiles]);
  }

  return (
    <MessageComposer
      value={text}
      onChange={setText}
      onSend={handleSend}
      disabled={isBlocked}
      disabledText={blockedText}
      sending={sending}
      canSend={canSend}
      extras={
        <>
          {sendingFiles ? <UploadProgress percent={progress} /> : null}
          {files.length && !sending ? (
            <FilePending
              files={files}
              onRemove={(index) =>
                setFiles((currentFiles) => currentFiles.filter((_, fileIndex) => fileIndex !== index))
              }
            />
          ) : null}
          {error ? <p className={s.error}>{error}</p> : null}
        </>
      }
      affix={
        <>
          <button
            type="button"
            className={s.clip}
            aria-label="Прикрепить файл"
            onClick={() => {
              if (files.length >= MAX_FILES) {
                setError(`Можно прикрепить не больше ${MAX_FILES} файлов`);
                return;
              }
              fileRef.current?.click();
            }}
            disabled={sending}
          >
            <ChatClipIcon />
          </button>

          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            multiple
            hidden
            onChange={handleFileChange}
          />
        </>
      }
    />
  );
}
