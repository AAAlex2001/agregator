"use client";

import { useRef } from "react";
import {
  TICKET_CATEGORIES,
  TICKET_CATEGORY_LABELS,
  TICKET_FILE_ACCEPT,
  TICKET_FILES_HINT,
} from "@/entities/ticket";
import type { Ticket } from "@/entities/ticket";
import { Button } from "@/shared/ui/button";
import { FileGallery } from "@/shared/ui/file-gallery";
import { ChevronIcon } from "@/shared/ui/icons";
import { Select } from "@/shared/ui/select";
import { TextArea } from "@/shared/ui/text-area";
import { TextInput } from "@/shared/ui/text-input";
import { useCreateTicket } from "../../model/use-create-ticket";
import styles from "./style.module.scss";

/** Наибольшая длина первого сообщения. */
const MESSAGE_MAX_LENGTH = 5000;

/** Темы обращения для выпадающего списка. */
const CATEGORY_OPTIONS = TICKET_CATEGORIES.map((category) => ({
  value: category,
  label: TICKET_CATEGORY_LABELS[category],
}));

/** Возврат к списку и открытие созданного обращения. */
interface CreateTicketFormProps {
  onCancel: () => void;
  onCreated: (ticket: Ticket) => void;
}

/** Форма нового обращения: тема, категория, сообщение и файлы. */
export function CreateTicketForm({ onCancel, onCreated }: CreateTicketFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, attachments, changeField, changeCategory, submit } = useCreateTicket({
    onCreated,
  });

  /** Принимает только тему из списка обращений. */
  function selectCategory(value: string) {
    const category = TICKET_CATEGORIES.find((item) => item === value);

    if (category) {
      changeCategory(category);
    }
  }

  return (
    <form
      className={styles.panel}
      onSubmit={submit}
    >
      <header className={styles.head}>
        <button
          type="button"
          className={styles.backButton}
          aria-label="Назад к списку"
          onClick={onCancel}
        >
          <ChevronIcon />
          <span>К списку</span>
        </button>
        <h2 className={styles.title}>Новое обращение</h2>
        <p className={styles.subtitle}>
          Опишите проблему максимально подробно — это ускорит ответ.
        </p>
      </header>

      <div className={styles.body}>
        <div className={styles.field}>
          <label
            className={styles.label}
            htmlFor="ticket-subject"
          >
            Тема обращения
          </label>
          <TextInput
            id="ticket-subject"
            placeholder="Кратко опишите суть"
            required
            value={state.subject}
            onChange={(event) => changeField("subject", event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Категория</span>
          <Select
            ariaLabel="Категория"
            options={CATEGORY_OPTIONS}
            value={state.category}
            onChange={selectCategory}
          />
        </div>

        <div className={styles.field}>
          <label
            className={styles.label}
            htmlFor="ticket-message"
          >
            Сообщение
          </label>
          <TextArea
            id="ticket-message"
            placeholder="Опишите вопрос. Если связан с заказом или откликом — укажите номер."
            rows={6}
            required
            maxLength={MESSAGE_MAX_LENGTH}
            value={state.message}
            onChange={(event) => changeField("message", event.target.value)}
          />
          <span className={styles.counter}>
            {state.message.length} / {MESSAGE_MAX_LENGTH}
          </span>
        </div>

        <div className={styles.field}>
          <FileGallery
            items={attachments.items}
            label="Файлы (необязательно)"
            labelClassName={styles.label}
            hint={TICKET_FILES_HINT}
            hintClassName={styles.hint}
            variant="editable"
            onAdd={attachments.isFull ? undefined : () => fileInputRef.current?.click()}
            input={
              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                accept={TICKET_FILE_ACCEPT}
                onChange={(event) => {
                  attachments.addFiles(event.currentTarget.files);
                  event.currentTarget.value = "";
                }}
              />
            }
          />
        </div>
      </div>

      <footer className={styles.footer}>
        <Button
          variant="outline"
          size="md"
          onClick={onCancel}
        >
          Отмена
        </Button>
        <Button
          variant="primary"
          size="md"
          type="submit"
          isLoading={state.isSubmitting}
        >
          Отправить обращение
        </Button>
      </footer>
    </form>
  );
}
