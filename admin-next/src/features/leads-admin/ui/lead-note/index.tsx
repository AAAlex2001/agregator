"use client";

import Button from "@/shared/ui/button";
import Textarea from "@/shared/ui/textarea";
import styles from "./style.module.scss";

type LeadNoteProps = {
  comment: string;
  editing: boolean;
  draft: string;
  onOpen: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
};

/** Заметка менеджера по заявке: текст и редактирование на месте. */
const LeadNote = ({ comment, editing, draft, onOpen, onChange, onSave, onClose }: LeadNoteProps) => {
  if (editing) {
    return (
      <div className={styles.editor}>
        <Textarea ariaLabel="Заметка менеджера" rows={3} maxLength={4000} value={draft} onChange={onChange} />
        <div className={styles.actions}>
          <Button size="sm" onClick={onSave}>
            Сохранить
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.note}>
      {comment ? <p className={styles.text}>{comment}</p> : <span className={styles.empty}>Заметки нет</span>}
      <button type="button" className={styles.edit} onClick={onOpen}>
        {comment ? "Изменить" : "Добавить заметку"}
      </button>
    </div>
  );
};

export default LeadNote;
