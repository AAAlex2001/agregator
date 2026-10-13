"use client";

import { useId, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import Button from "@/source/shared/ui/Button";
import { Title } from "@/source/shared/ui/Typography";
import { Modal } from "@/source/shared/ui/Modal";
import s from "./PostRichEditor.module.scss";

interface Props {
  onClose: () => void;
  onSave: (href: string) => void;
}

/** Форма ссылки открывается отдельно от формы публикации. */
export function LinkModal({ onClose, onSave }: Props) {
  const id = useId();
  const [url, setUrl] = useState("");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    onSave(url.trim());
  }

  return createPortal(
    <Modal open onClose={onClose} ariaLabel="Добавить ссылку">
      <form className={s.linkForm} onSubmit={save}>
        <Title text="Ссылка" />
        <label htmlFor={id}>Адрес</label>
        <input
          id={id}
          className={s.input}
          type="url"
          required
          pattern="https?://.*"
          title="Ссылка должна начинаться с https:// или http://"
          value={url}
          placeholder="https://"
          onChange={(event) => setUrl(event.target.value)}
        />
        <div className={s.buttons}>
          <Button type="submit">Добавить</Button>
          <Button variant="transparent" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </form>
    </Modal>,
    document.body,
  );
}
