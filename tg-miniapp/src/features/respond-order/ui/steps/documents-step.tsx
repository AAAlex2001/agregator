import cn from "classnames";
import type { Order, OrderDocuments } from "@/entites/order";
import { openFile } from "@/shared/lib/files";
import { Field } from "@/shared/ui";
import { FileTypeIcon } from "@/shared/ui/file-icon";
import { DocIcon } from "@/shared/ui/icons/interface";
import s from "./documents-step.module.scss";

const CATEGORIES: { key: keyof OrderDocuments; label: string }[] = [
  { key: "technical", label: "Техническое задание" },
  { key: "contract", label: "Проект договора" },
  { key: "company", label: "Карточка предприятия" },
];

interface Tile {
  label: string;
  url?: string;
}

export function DocumentsStep({ order }: { order: Order }) {
  const docs = order.documents;
  const others = docs?.other ?? [];
  const tiles: Tile[] = [
    ...CATEGORIES.map((cat) => ({ label: cat.label, url: (docs?.[cat.key] ?? [])[0] })),
    ...(others.length ? others.map((url, i) => ({ label: `Иное ${i + 1}`, url })) : [{ label: "Иное" }]),
  ];
  const hasAny = tiles.some((t) => t.url);

  return (
    <Field
      label="Документы заказчика"
      hint={hasAny ? "Нажмите на документ, чтобы открыть." : "Заказчик пока не приложил документы."}
    >
      <div className={s.docGrid}>
        {tiles.map((t, i) =>
          t.url ? (
            <button key={i} className={s.doc} onClick={() => openFile(t.url!)}>
              <span className={s.thumb}>
                <FileTypeIcon name={t.url} className={s.docIcon} />
              </span>
              <span className={s.docCap}>{t.label}</span>
            </button>
          ) : (
            <div key={i} className={cn(s.doc, s.docEmpty)}>
              <span className={s.thumb}>
                <DocIcon className={s.docEmptyIcon} />
              </span>
              <span className={s.docCap}>{t.label}</span>
            </div>
          ),
        )}
      </div>
    </Field>
  );
}
