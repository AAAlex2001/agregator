"use client";

import {
  BlitzChecklistPicker,
  blitzDocumentsReportUrl,
  uploadBlitzChecklist,
  useBlitzAuditCatalog,
  useChecklistFiles,
} from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { Loader } from "@/shared/ui/loader";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { StepNote } from "../step-note";
import styles from "./style.module.scss";

/** Заказчик загружает документы по перечню, пока аудиторы их проверяют. */
export function ChecklistPanel({ order, onChange }: BlitzStepProps) {
  const { catalog, error } = useBlitzAuditCatalog();
  const checklist = useChecklistFiles();
  const { isPending, run } = useBlitzAction(onChange);
  const provided = order.documents.flatMap((document) => (
    document.kind === "audit_item" && document.item_number !== null ? [document.item_number] : []
  ));

  /** Отправляет выбранные документы. */
  async function upload() {
    const isDone = await run(
      () => uploadBlitzChecklist(order.id, checklist.entries),
      "Документы загружены",
    );

    if (isDone) {
      checklist.clearFiles();
    }
  }

  return (
    <StepNote
      title="Документы по перечню"
      text={"Приложите документы к пунктам перечня. Аудиторы проверяют их по мере поступления; "
        + "если чего-то не хватит, придут замечания."}
    >
      {!catalog && !error && (
        <div className={styles.loader}>
          <Loader label="" />
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {catalog && (
        <BlitzChecklistPicker
          items={catalog.checklist}
          entries={checklist.entries}
          provided={provided}
          onAdd={checklist.addFiles}
          onRemove={checklist.removeFile}
        />
      )}
      <div className={styles.actions}>
        <Button
          isLoading={isPending}
          disabled={checklist.entries.length === 0}
          onClick={() => void upload()}
        >
          Загрузить документы
        </Button>
        <Button
          variant="outline"
          href={blitzDocumentsReportUrl(order.id)}
        >
          Отчёт о представленных документах
        </Button>
      </div>
    </StepNote>
  );
}