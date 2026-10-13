"use client";

import cn from "classnames";
import { getFileGalleryPreviewUrl, getFileGalleryThumbUrl, isImageFileName } from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { formatWithTime } from "@/source/shared/lib/formatDate";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import type { TicketAttachment, TicketMessage } from "../model/types";
import s from "./MessageBubble.module.scss";

function attachmentItem(attachment: TicketAttachment, key: string): FileGalleryItem {
  const url = resolveFileUrl(attachment.url);
  const isImage = isImageFileName(attachment.name);
  return {
    id: key,
    name: attachment.name,
    url,
    previewUrl: isImage ? url : getFileGalleryPreviewUrl(url, attachment.name),
    thumbnailUrl: getFileGalleryThumbUrl(url, attachment.name),
    isImage,
  };
}

interface MessageBubbleProps {
  message: TicketMessage;
  showHead: boolean;
}

/** Сообщение в переписке. Имя и время показываются у первого сообщения автора в серии. */
export function MessageBubble({ message, showHead }: MessageBubbleProps) {
  const isUser = message.author === "user";

  return (
    <div className={cn(isUser ? s.user : s.support, { [s.continued]: !showHead })}>
      {showHead && (
        <div className={s.head}>
          <span className={s.author}>{message.author_name || (isUser ? "Вы" : "Поддержка")}</span>
          <span className={s.date}>{formatWithTime(message.created_at)}</span>
        </div>
      )}
      <div className={s.bubble}>
        {message.text && <p className={s.text}>{message.text}</p>}
        {message.attachments.length > 0 && (
          <FileGallery
            items={message.attachments.map((attachment, index) => attachmentItem(attachment, `${message.id}-${index}`))}
            hideWhenEmpty
            blockClassName={s.gallery}
          />
        )}
      </div>
    </div>
  );
}
