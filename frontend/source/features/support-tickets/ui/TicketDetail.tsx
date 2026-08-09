"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowIcon, ChatClipIcon } from "@/source/shared/ui/icons";
import {
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import type { FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { MessageComposer } from "@/source/shared/ui/MessageComposer";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  MessageGroup,
  TicketHeader,
  type SupportTicket,
  type TicketMessage,
} from "@/source/entities/ticket";
import {
  FILE_ACCEPT,
  MAX_FILES,
  MAX_MESSAGE_LENGTH,
  ticketFilesError,
} from "../model/files";
import s from "./TicketDetail.module.scss";

interface Props {
  ticket: SupportTicket;
  onBack: () => void;
  onReply: (text: string, files: File[]) => void;
}

interface PreviewItem {
  file: File;
  url: string;
}

interface Group {
  key: string;
  isUser: boolean;
  authorName: string;
  messages: TicketMessage[];
}

function groupMessages(messages: TicketMessage[]): Group[] {
  const groups: Group[] = [];
  for (const message of messages) {
    const isUser = message.author === "user";
    const last = groups[groups.length - 1];
    if (last && last.isUser === isUser) {
      last.messages.push(message);
      continue;
    }
    groups.push({
      key: `${message.author}-${message.id}`,
      isUser,
      authorName: message.authorName || (isUser ? "Вы" : "Поддержка"),
      messages: [message],
    });
  }
  return groups;
}

export function TicketDetail({ ticket, onBack, onReply }: Props) {
  const { showError } = useNotifications();
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  const isClosed = ticket.status === "CLOSED";
  const groups = groupMessages(ticket.messages);

  useEffect(() => {
    const next = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews(next);
    return () => {
      next.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [ticket.messages.length]);

  const handleSend = () => {
    if (isClosed) return;

    const text = draft.trim();
    if (!text && files.length === 0) {
      showError("Введите сообщение или прикрепите файл");
      return;
    }
    if (text.length > MAX_MESSAGE_LENGTH) {
      showError(`Сообщение не должно превышать ${MAX_MESSAGE_LENGTH} символов`);
      return;
    }

    onReply(text, files);
    setDraft("");
    setFiles([]);
  };

  const handleAddFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const next = Array.from(list);
    const error = ticketFilesError(files, next);
    if (error) {
      showError(error);
      return;
    }
    setFiles((prev) => [...prev, ...next]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const pendingItems: FileGalleryItem[] = files
    .map((file, index) => {
      const url = previews.find((item) => item.file === file)?.url ?? "";
      const isImage = isImageFileName(file.name);
      return {
        id: `pending-${file.name}-${file.lastModified}-${index}`,
        name: file.name,
        url,
        previewUrl: isImage ? url : getFileGalleryPreviewUrl(url, file.name),
        thumbnailUrl: getFileGalleryThumbUrl(url, file.name),
        isImage,
        onRemove: () => removeFile(index),
      };
    })
    .filter((item) => item.url);

  return (
    <div className={s.card}>
      <div className={s.headerRow}>
        <button
          type="button"
          className={s.backBtn}
          aria-label="Назад"
          onClick={onBack}
        >
          <ArrowIcon color="currentColor" />
        </button>
        <TicketHeader ticket={ticket} />
      </div>

      <div className={s.thread} ref={threadRef} role="log" aria-live="polite">
        {groups.map((group) => (
          <MessageGroup
            key={group.key}
            authorName={group.authorName}
            isUser={group.isUser}
            messages={group.messages}
          />
        ))}
      </div>

      <MessageComposer
        value={draft}
        onChange={setDraft}
        onSend={handleSend}
        multiline
        disabled={isClosed}
        disabledText="Обращение закрыто. Если вопрос остался — создайте новое."
        canSend={draft.trim().length > 0 || files.length > 0}
        extras={
          !isClosed && pendingItems.length > 0 ? (
            <FileGallery
              items={pendingItems}
              hideWhenEmpty
              variant="editable"
              blockClassName={s.pendingFiles}
            />
          ) : null
        }
        affix={
          !isClosed ? (
            <>
              <button
                type="button"
                className={s.clip}
                aria-label="Прикрепить файл"
                onClick={() => {
                  if (files.length >= MAX_FILES) {
                    showError(`Можно прикрепить не больше ${MAX_FILES} файлов`);
                    return;
                  }
                  fileInputRef.current?.click();
                }}
              >
                <ChatClipIcon />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept={FILE_ACCEPT}
                multiple
                hidden
                onChange={(event) => {
                  handleAddFiles(event.currentTarget.files);
                  event.currentTarget.value = "";
                }}
              />
            </>
          ) : null
        }
      />
    </div>
  );
}
