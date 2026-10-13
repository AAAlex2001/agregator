"use client";

import type { Editor } from "@tiptap/react";
import { useState } from "react";
import { LinkIcon } from "../icons";
import { addLink } from "../model/tools";
import { LinkModal } from "./LinkModal";
import s from "./RichTextEditor.module.scss";

/** Добавляет ссылку или снимает её с выделенного текста. */
export function LinkButton({
  editor,
  active,
  disabled,
}: {
  editor: Editor;
  active: boolean;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={s.tool}
        aria-label="Ссылка"
        title="Ссылка"
        aria-pressed={active}
        disabled={disabled}
        onClick={() => {
          if (active) editor.chain().focus().unsetLink().run();
          else setOpen(true);
        }}
      >
        <LinkIcon />
      </button>
      {open && (
        <LinkModal
          onClose={() => setOpen(false)}
          onSave={(href) => {
            addLink(editor, href);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
