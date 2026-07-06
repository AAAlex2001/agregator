import { FileTypeIcon } from "@/shared/ui/file-icon";
import { fileName, openFile } from "@/shared/lib/files";
import s from "./style.module.scss";

export function FileRow({ url }: { url: string }) {
  return (
    <button type="button" className={s.row} onClick={() => openFile(url)}>
      <FileTypeIcon name={url} className={s.icon} />
      <span className={s.name}>{fileName(url)}</span>
    </button>
  );
}
