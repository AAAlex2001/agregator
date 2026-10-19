"use client";

import type { Editor } from "@tiptap/react";
import { EmojiPicker } from "frimousse";
import { useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import { SmileIcon } from "@/shared/ui/icons";
import { Loader } from "@/shared/ui/loader";
import { EditorButton } from "../editor-button";
import styles from "./style.module.scss";

/** Редактор и блокировка панели инструментов. */
interface EmojiButtonProps {
  editor: Editor;
  disabled: boolean;
}

/** Выбор эмодзи с поиском на русском; смайлик вставляется в место курсора. */
export function EmojiButton({ editor, disabled }: EmojiButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  /** Закрывает выбор, когда фокус ушёл из кнопки и списка. */
  function closeOnBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  }

  /** Закрывает выбор по Escape, не закрывая окно вокруг редактора. */
  function closeOnEscape(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      setIsOpen(false);
    }
  }

  /** Вставляет выбранный смайлик и закрывает список. */
  function addEmoji({ emoji }: { emoji: string }) {
    editor.chain().focus().insertContent(emoji).run();
    setIsOpen(false);
  }

  return (
    <div onBlur={closeOnBlur}>
      <EditorButton
        label="Вставить смайлик"
        expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
      >
        <SmileIcon />
      </EditorButton>
      {isOpen && (
        <div
          className={styles.popover}
          onKeyDown={closeOnEscape}
        >
          <EmojiPicker.Root
            className={styles.picker}
            locale="ru"
            columns={8}
            onEmojiSelect={addEmoji}
          >
            <EmojiPicker.Search
              className={styles.search}
              placeholder="Найти смайлик"
            />
            <EmojiPicker.Viewport className={styles.viewport}>
              <EmojiPicker.Loading className={styles.status}>
                <Loader size="sm" />
              </EmojiPicker.Loading>
              <EmojiPicker.Empty className={styles.status}>
                Ничего не нашлось
              </EmojiPicker.Empty>
              <EmojiPicker.List />
            </EmojiPicker.Viewport>
          </EmojiPicker.Root>
        </div>
      )}
    </div>
  );
}
