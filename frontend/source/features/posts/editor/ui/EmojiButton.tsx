"use client";

import type { Editor } from "@tiptap/react";
import { EmojiPicker } from "frimousse";
import { useState } from "react";
import Loader from "@/source/shared/ui/Loader";
import { SmileIcon } from "../icons";
import { addEmoji } from "../model/tools";
import s from "./PostRichEditor.module.scss";

/** Выбор эмодзи с поиском на русском. */
export function EmojiButton({
  editor,
  disabled,
}: {
  editor: Editor;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        className={s.tool}
        aria-label="Смайлик"
        title="Смайлик"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        <SmileIcon />
      </button>
      {open && (
        <div
          className={s.popover}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              setOpen(false);
            }
          }}
        >
          <EmojiPicker.Root
            className={s.picker}
            locale="ru"
            columns={8}
            onEmojiSelect={({ emoji }) => {
              addEmoji(editor, emoji);
              setOpen(false);
            }}
          >
            <EmojiPicker.Search
              className={s.input}
              placeholder="Найти смайлик"
            />
            <EmojiPicker.Viewport className={s.viewport}>
              <EmojiPicker.Loading className={s.status}>
                <Loader size="sm" />
              </EmojiPicker.Loading>
              <EmojiPicker.Empty className={s.status}>
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
