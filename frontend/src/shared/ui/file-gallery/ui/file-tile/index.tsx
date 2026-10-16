import cn from "classnames";
import type { MouseEvent } from "react";
import { FileIcon } from "@/shared/ui/icons";
import { getFileExtension, isImageFileName } from "../../model/file-preview";
import type { FileGalleryItem } from "../../model/types";
import styles from "./style.module.scss";

/** Данные одной плитки и действие открытия выбранного файла. */
interface FileTileProps {
  item: FileGalleryItem;
  variant: "readonly" | "editable";
  onOpen: () => void;
}

/** Плитка изображения или документа с необязательной кнопкой удаления. */
export function FileTile({ item, variant, onOpen }: FileTileProps) {
  const isImage = item.isImage ?? isImageFileName(item.name);

  /** Удаляет файл, не открывая его и не отправляя форму. */
  function remove(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    item.onRemove?.();
  }

  return (
    <div className={styles.item}>
      <button
        type="button"
        className={cn(
          styles.tile,
          variant === "editable" ? styles.tileEditable : styles.tileReadonly,
          { [styles.imageTile]: isImage },
        )}
        onClick={onOpen}
        title={item.name}
        aria-label={`Открыть файл ${item.name}`}
      >
        {isImage ? (
          <img
            src={item.url}
            alt={item.name}
            className={styles.image}
          />
        ) : (
          <span className={styles.fileMeta}>
            <FileIcon className={styles.fileIcon} />
            <span className={styles.fileExtension}>{getFileExtension(item.name)}</span>
          </span>
        )}
      </button>

      {item.onRemove && (
        <button
          type="button"
          className={styles.removeButton}
          onClick={remove}
          aria-label={`Удалить файл ${item.name}`}
        >
          ×
        </button>
      )}
    </div>
  );
}
