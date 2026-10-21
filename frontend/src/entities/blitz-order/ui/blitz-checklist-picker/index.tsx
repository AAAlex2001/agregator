"use client";

import cn from "classnames";
import { useRef, useState } from "react";
import { RemoveButton } from "@/shared/ui/remove-button";
import { BLITZ_AUDIT_ACCEPT } from "../../config/files";
import type { BlitzChecklistFile, BlitzChecklistItem } from "../../model/audit-types";
import styles from "./style.module.scss";

/** Перечень, выбранные файлы, уже представленные пункты и действия с файлами. */
interface BlitzChecklistPickerProps {
  items: BlitzChecklistItem[];
  entries: BlitzChecklistFile[];
  provided: number[];
  onAdd: (item: number, files: FileList | null) => void;
  onRemove: (entry: BlitzChecklistFile) => void;
}

/** Перечень документов для аудита: к каждому пункту можно приложить файлы. */
export function BlitzChecklistPicker({
  items,
  entries,
  provided,
  onAdd,
  onRemove,
}: BlitzChecklistPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState<number | null>(null);

  /** Открывает выбор файлов для пункта. */
  function pick(item: number) {
    setTarget(item);
    inputRef.current?.click();
  }

  return (
    <div className={styles.picker}>
      <ol className={styles.list}>
        {items.map((item) => {
          const files = entries.filter((entry) => entry.item === item.number);
          const isProvided = provided.includes(item.number);

          return (
            <li
              key={item.number}
              className={cn(styles.item, { [styles.filled]: files.length > 0 || isProvided })}
            >
              <span className={styles.number}>{item.number}</span>
              <div className={styles.body}>
                <span className={styles.title}>{item.title}</span>
                {isProvided && <span className={styles.provided}>Уже представлен</span>}
                {files.map((entry) => (
                  <span
                    key={`${entry.file.name}-${entry.file.lastModified}`}
                    className={styles.file}
                  >
                    <span className={styles.fileName}>{entry.file.name}</span>
                    <RemoveButton
                      label={`Убрать ${entry.file.name}`}
                      onClick={() => onRemove(entry)}
                    />
                  </span>
                ))}
              </div>
              <button
                type="button"
                className={styles.attach}
                onClick={() => pick(item.number)}
              >
                Приложить
              </button>
            </li>
          );
        })}
      </ol>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept={BLITZ_AUDIT_ACCEPT}
        onChange={(event) => {
          if (target !== null) {
            onAdd(target, event.currentTarget.files);
          }
          event.currentTarget.value = "";
        }}
      />
    </div>
  );
}