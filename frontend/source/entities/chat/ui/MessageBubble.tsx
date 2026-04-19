import {
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import type { FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { ChatCheckReadIcon, ChatCheckSentIcon } from "@/source/shared/ui/icons";
import type { ChatMessageData } from "@/source/entities/chat";
import s from "./MessageBubble.module.scss";

interface MessageBubbleProps {
  message: ChatMessageData;
  isMine: boolean;
}

function formatMessageTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const CheckIcon = message.is_read ? ChatCheckReadIcon : ChatCheckSentIcon;
  const fileItem: FileGalleryItem | null = message.file_url
    ? (() => {
        const url = resolveFileUrl(message.file_url);
        const name = message.file_name || "Файл";
        const isImage = isImageFileName(name);

        return {
          id: `chat-file-${message.id}`,
          name,
          url,
          previewUrl: isImage ? url : getFileGalleryPreviewUrl(url, name),
          thumbnailUrl: getFileGalleryThumbUrl(url, name),
          isImage,
        };
      })()
    : null;

  return (
    <div className={`${s.bubble} ${isMine ? s.sent : s.received}`.trim()}>
      <div className={s.content}>
        {message.text ? <span className={s.text}>{message.text}</span> : null}
        {fileItem ? (
          <FileGallery
            items={[fileItem]}
            hideWhenEmpty
            blockClassName={s.gallery}
            gridProps={{ className: s.galleryGrid }}
          />
        ) : null}
      </div>
      <span className={s.meta}>
        <span className={s.time}>{formatMessageTime(message.created_at)}</span>
        <CheckIcon className={s.check} />
      </span>
    </div>
  );
}