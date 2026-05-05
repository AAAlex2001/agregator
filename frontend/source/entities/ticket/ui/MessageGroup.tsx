"use client";

import {
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import type { FileGalleryItem } from "@/source/shared/ui/FileGallery";
import type { TicketMessage } from "../model/types";
import s from "./MessageGroup.module.scss";

interface Props {
  authorName: string;
  isUser: boolean;
  messages: TicketMessage[];
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function attachmentItems(message: TicketMessage): FileGalleryItem[] {
  return (message.attachments ?? []).map((attachment, index) => {
    const url = resolveFileUrl(attachment.url);
    const name = attachment.name || `Файл ${index + 1}`;
    const isImage = isImageFileName(name);
    return {
      id: `ticket-${message.id}-${index}`,
      name,
      url,
      previewUrl: isImage ? url : getFileGalleryPreviewUrl(url, name),
      thumbnailUrl: getFileGalleryThumbUrl(url, name),
      isImage,
    };
  });
}

export function MessageGroup({ authorName, isUser, messages }: Props) {
  if (messages.length === 0) return null;
  const head = messages[0];
  const groupClass = isUser ? s.groupUser : s.groupSupport;

  return (
    <div className={groupClass}>
      <div className={s.head}>
        <span className={s.author}>{authorName}</span>
        <span className={s.date}>{formatDateTime(head.createdAt)}</span>
      </div>

      <div className={s.bubbles}>
        {messages.map((message) => {
          const items = attachmentItems(message);
          return (
            <div key={message.id} className={s.bubble}>
              {message.text && <p className={s.text}>{message.text}</p>}
              {items.length > 0 && (
                <FileGallery items={items} hideWhenEmpty blockClassName={s.gallery} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
