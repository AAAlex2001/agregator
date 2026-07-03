import cn from "classnames";
import { openFile } from "@/shared/lib/files";
import { FileTypeIcon } from "@/shared/ui/file-icon";
import { DocIcon } from "@/shared/ui/icons/interface";
import type { OrderDocuments } from "../../model/api";
import s from "./style.module.scss";

const CATEGORIES: { key: keyof OrderDocuments; label: string }[] = [
  { key: "technical", label: "Техническое задание" },
  { key: "contract", label: "Проект договора" },
  { key: "company", label: "Карточка предприятия" },
];

interface Tile {
  label: string;
  url?: string;
}

export function DocumentsGrid({ documents }: { documents: OrderDocuments | null }) {
  const others = documents?.other ?? [];
  const tiles: Tile[] = [
    ...CATEGORIES.map((cat) => ({ label: cat.label, url: (documents?.[cat.key] ?? [])[0] })),
    ...(others.length ? others.map((url, i) => ({ label: `Иное ${i + 1}`, url })) : [{ label: "Иное" }]),
  ];

  return (
    <div className={s.grid}>
      {tiles.map((t, i) =>
        t.url ? (
          <button key={i} className={s.doc} onClick={() => openFile(t.url!)}>
            <span className={s.thumb}>
              <FileTypeIcon name={t.url} className={s.icon} />
            </span>
            <span className={s.cap}>{t.label}</span>
          </button>
        ) : (
          <div key={i} className={cn(s.doc, s.docEmpty)}>
            <span className={s.thumb}>
              <DocIcon className={s.emptyIcon} />
            </span>
            <span className={s.cap}>{t.label}</span>
          </div>
        ),
      )}
    </div>
  );
}
