import cn from "classnames";
import { fileName, openFile } from "@/shared/lib/files";
import { formatClock } from "@/shared/lib/format";
import { FileTypeIcon } from "@/shared/ui/file-icon";
import type { ChatMessage } from "../../model/types";
import s from "./style.module.scss";

interface Props {
  message: ChatMessage;
  mine: boolean;
}

export function MessageBubble({ message, mine }: Props) {
  const files = message.attachments.length
    ? message.attachments
    : message.file_url
      ? [{ url: message.file_url, name: message.file_name || fileName(message.file_url) }]
      : [];

  return (
    <div className={cn(s.row, { [s.mine]: mine })}>
      <div className={s.bubble}>
        {message.text && <p className={s.text}>{message.text}</p>}
        {files.map((file) => (
          <button key={file.url} type="button" className={s.file} onClick={() => openFile(file.url)}>
            <FileTypeIcon name={file.name} className={s.fileIcon} />
            <span className={s.fileName}>{file.name}</span>
          </button>
        ))}
        <span className={s.time}>{formatClock(message.created_at)}</span>
      </div>
    </div>
  );
}
