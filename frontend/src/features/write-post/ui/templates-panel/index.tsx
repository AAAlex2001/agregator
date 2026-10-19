"use client";

import { useCurrentEditor } from "@tiptap/react";
import { Button } from "@/shared/ui/button";
import { RemoveButton } from "@/shared/ui/remove-button";
import { Skeleton } from "@/shared/ui/skeleton";
import { TextInput } from "@/shared/ui/text-input";
import { useTemplateActions } from "../../model/use-template-actions";
import styles from "./style.module.scss";

/** Панель шаблонов над редактором: вставить готовый текст или сохранить текущий. */
export function TemplatesPanel() {
  const { editor } = useCurrentEditor();
  const {
    templates,
    error,
    isLoading,
    title,
    setTitle,
    isSaving,
    save,
    remove,
  } = useTemplateActions();

  if (!editor) {
    return null;
  }

  /** Заменяет текст в редакторе текстом шаблона. */
  function insert(html: string) {
    editor?.commands.setContent(html, { emitUpdate: true });
  }

  return (
    <section
      className={styles.panel}
      aria-label="Шаблоны"
    >
      <div className={styles.save}>
        <TextInput
          value={title}
          maxLength={100}
          placeholder="Название шаблона"
          className={styles.title}
          aria-label="Название шаблона"
          onChange={(event) => setTitle(event.target.value)}
        />
        <Button
          variant="outline"
          size="sm"
          className={styles.saveButton}
          isLoading={isSaving}
          disabled={editor.isEmpty}
          onClick={() => save(editor.getHTML())}
        >
          Сохранить текст шаблоном
        </Button>
      </div>
      {isLoading && (
        <div className={styles.list}>
          <Skeleton className={styles.skeleton} />
          <Skeleton className={styles.skeleton} />
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {!isLoading && !error && templates.length === 0 && (
        <p className={styles.empty}>
          Шаблонов пока нет. Сохраните текст, который часто повторяется.
        </p>
      )}
      <ul className={styles.list}>
        {templates.map((template) => (
          <li
            key={template.id}
            className={styles.item}
          >
            <button
              type="button"
              className={styles.insert}
              onClick={() => insert(template.html)}
            >
              {template.title}
            </button>
            <RemoveButton
              label={`Удалить шаблон «${template.title}»`}
              onClick={() => remove(template.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
