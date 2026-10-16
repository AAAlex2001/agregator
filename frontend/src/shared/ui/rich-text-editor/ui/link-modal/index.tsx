"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Закрытие окна и передача адреса ссылки. */
interface LinkModalProps {
  onClose: () => void;
  onSave: (href: string) => void;
}

/**
 * Окно адреса ссылки. Выносится в body:
 * форма ссылки не может лежать внутри формы, где стоит редактор.
 */
export function LinkModal({ onClose, onSave }: LinkModalProps) {
  const id = useId();
  const [url, setUrl] = useState("");

  /** Передаёт адрес, не отправляя внешнюю форму публикации. */
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    onSave(url.trim());
  }

  return createPortal(
    <Modal
      open
      onClose={onClose}
      ariaLabel="Добавить ссылку"
    >
      <form
        className={styles.form}
        onSubmit={save}
      >
        <Title text="Ссылка" />
        <label htmlFor={id}>Адрес</label>
        <input
          id={id}
          className={styles.input}
          type="url"
          required
          pattern="https?://.*"
          title="Ссылка должна начинаться с https:// или http://"
          value={url}
          placeholder="https://"
          onChange={(event) => setUrl(event.target.value)}
        />
        <div className={styles.buttons}>
          <Button type="submit">Добавить</Button>
          <Button
            variant="transparent"
            onClick={onClose}
          >
            Отмена
          </Button>
        </div>
      </form>
    </Modal>,
    document.body,
  );
}
