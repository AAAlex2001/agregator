"use client";

import { useRef } from "react";
import {
  CATEGORY_LABEL,
  TICKET_CATEGORIES,
  TICKET_FILE_ACCEPT,
  TICKET_FILES_HINT,
  type Ticket,
  type TicketCategory,
} from "@/source/entities/ticket";
import Button from "@/source/shared/ui/Button";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import { ChevronIcon } from "@/source/shared/ui/icons";
import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { Select } from "@/source/shared/ui/Select";
import { useCreateTicket } from "../model/useCreateTicket";
import s from "./CreateTicketForm.module.scss";

const MAX_MESSAGE_LENGTH = 5000;
const CATEGORY_OPTIONS = TICKET_CATEGORIES.map((category) => ({ value: category, label: CATEGORY_LABEL[category] }));

interface CreateTicketFormProps {
  onCancel: () => void;
  onCreated: (ticket: Ticket) => void;
}

/** Форма нового обращения: тема, категория, сообщение и файлы. */
export function CreateTicketForm({ onCancel, onCreated }: CreateTicketFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fields, isSending, attachments, change, submit } = useCreateTicket(onCreated);

  return (
    <form className={s.panel} onSubmit={submit}>
      <header className={s.head}>
        <button type="button" className={s.backButton} onClick={onCancel} aria-label="Назад к списку">
          <ChevronIcon />
          <span>К списку</span>
        </button>
        <h2 className={s.title}>Новое обращение</h2>
        <p className={s.subtitle}>Опишите проблему максимально подробно — это ускорит ответ.</p>
      </header>

      <div className={s.body}>
        <div className={s.field}>
          <label className={s.label} htmlFor="ticket-subject">
            Тема обращения
          </label>
          <TextInput
            id="ticket-subject"
            placeholder="Кратко опишите суть"
            required
            value={fields.subject}
            onChange={(event) => change({ ...fields, subject: event.target.value })}
          />
        </div>

        <div className={s.field}>
          <span className={s.label}>Категория</span>
          <Select
            ariaLabel="Категория"
            options={CATEGORY_OPTIONS}
            value={fields.category}
            onChange={(category) => change({ ...fields, category: category as TicketCategory })}
          />
        </div>

        <div className={s.field}>
          <label className={s.label} htmlFor="ticket-message">
            Сообщение
          </label>
          <TextArea
            id="ticket-message"
            placeholder="Опишите вопрос. Если связан с заказом или откликом — укажите номер."
            rows={6}
            required
            maxLength={MAX_MESSAGE_LENGTH}
            value={fields.message}
            onChange={(event) => change({ ...fields, message: event.target.value })}
          />
          <span className={s.counter}>
            {fields.message.length} / {MAX_MESSAGE_LENGTH}
          </span>
        </div>

        <div className={s.field}>
          <FileGallery
            items={attachments.items}
            label="Файлы (необязательно)"
            labelClassName={s.label}
            hint={TICKET_FILES_HINT}
            hintClassName={s.hint}
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
                  attachments.add(event.currentTarget.files);
                  event.currentTarget.value = "";
                }}
              />
            }
          />
        </div>
      </div>

      <footer className={s.footer}>
        <Button variant="outline" size="md" type="button" onClick={onCancel}>
          Отмена
        </Button>
        <Button variant="primary" size="md" type="submit" isLoading={isSending}>
          Отправить обращение
        </Button>
      </footer>
    </form>
  );
}
