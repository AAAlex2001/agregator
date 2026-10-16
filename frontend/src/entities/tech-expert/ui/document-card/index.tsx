import { formatTechExpertDate } from "../../model/documents";
import type { TechExpertDocumentCard } from "../../model/types";
import { DocumentText } from "../document-text";
import styles from "./style.module.scss";

/** Открытый документ и переход к документу по ссылке из его текста. */
interface DocumentCardProps {
  card: TechExpertDocumentCard;
  onOpenDocument: (documentId: number) => void;
}

/** Карточка документа: отметки, реквизиты, публикации и текст. */
export function DocumentCard({ card, onOpenDocument }: DocumentCardProps) {
  const flags = [
    {
      label: "Важный документ",
      isShown: card.is_important,
    },
    {
      label: "Полный текст",
      isShown: card.has_text,
    },
    {
      label: "PDF",
      isShown: card.has_pdf,
    },
    {
      label: "Скан",
      isShown: card.has_scan,
    },
    {
      label: "Приложения",
      isShown: card.has_attachments,
    },
  ].filter((flag) => flag.isShown);
  const rows = [
    {
      label: "Тип документа",
      value: card.doctype,
    },
    {
      label: "Номер",
      value: card.number,
    },
    {
      label: "Дата регистрации",
      value: formatTechExpertDate(card.date),
    },
    {
      label: "Ведомство",
      value: card.department,
    },
    {
      label: "Статус",
      value: card.status,
    },
    {
      label: "Редакция",
      value: formatTechExpertDate(card.edition_date),
    },
    {
      label: "Изменение",
      value: formatTechExpertDate(card.change_date),
    },
  ];

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{card.name}</h2>

      {flags.length > 0 && (
        <div className={styles.flags}>
          {flags.map((flag) => (
            <span
              key={flag.label}
              className={styles.flag}
            >
              {flag.label}
            </span>
          ))}
        </div>
      )}

      <div className={styles.rows}>
        {rows.map((row) => (
          <div
            key={row.label}
            className={styles.row}
          >
            <span className={styles.label}>{row.label}</span>
            <span className={styles.value}>{row.value || "—"}</span>
          </div>
        ))}
      </div>

      {card.publications.length > 0 && (
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Публикации</span>
          {card.publications.map((publication) => (
            <p
              key={publication}
              className={styles.text}
            >
              {publication}
            </p>
          ))}
        </div>
      )}

      {card.has_text && (
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Текст документа</span>
          <DocumentText
            key={card.id}
            documentId={card.id}
            blocks={card.blocks}
            onOpenDocument={onOpenDocument}
          />
        </div>
      )}
    </div>
  );
}
