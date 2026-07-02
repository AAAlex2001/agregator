import type { Order, OrderDocuments } from "@/entites/order";
import s from "../respond-sheet.module.scss";

const CATEGORIES: { key: keyof OrderDocuments; label: string }[] = [
  { key: "technical", label: "Техническое задание" },
  { key: "contract", label: "Проект договора" },
  { key: "company", label: "Карточка предприятия" },
];

function ext(url: string): string {
  const tail = url.split("?")[0].split(".").pop();
  return tail ? tail.toUpperCase().slice(0, 4) : "ФАЙЛ";
}

interface Tile {
  label: string;
  url?: string;
}

export function DocumentsStep({ order }: { order: Order }) {
  const docs = order.documents;
  const others = docs?.other ?? [];
  const tiles: Tile[] = [
    ...CATEGORIES.map((c) => ({ label: c.label, url: (docs?.[c.key] ?? [])[0] })),
    ...(others.length ? others.map((url, i) => ({ label: `Иное ${i + 1}`, url })) : [{ label: "Иное" }]),
  ];
  const hasAny = tiles.some((t) => t.url);

  return (
    <div className={s.step}>
      <span className={s.blockLab}>Документы заказчика</span>
      <div className={s.docGrid}>
        {tiles.map((t, i) =>
          t.url ? (
            <a key={i} className={s.doc} href={t.url} target="_blank" rel="noreferrer">
              <span className={s.thumb}>{ext(t.url)}</span>
              <span className={s.docCap}>{t.label}</span>
            </a>
          ) : (
            <div key={i} className={`${s.doc} ${s.docEmpty}`}>
              <span className={s.thumb}>—</span>
              <span className={s.docCap}>{t.label}</span>
            </div>
          ),
        )}
      </div>
      <p className={s.note}>
        {hasAny ? "Нажмите на документ, чтобы открыть." : "Заказчик пока не приложил документы."}
      </p>
    </div>
  );
}
