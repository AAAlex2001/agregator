import { BottomSheet, ThemedImage } from "@/shared/ui";
import { FileTypeIcon } from "@/shared/ui/file-icon";
import { openFile } from "@/shared/lib/files";
import { pluralRu } from "@/shared/lib/format";
import type { Order } from "@/entites/order";
import s from "./archive-order-sheet.module.scss";

const DOC_LABELS = ["Техническое задание", "Проект договора", "Карточка предприятия"] as const;

function FileRow({ url, label }: { url: string; label?: string }) {
  return (
    <button type="button" className={s.file} onClick={() => openFile(url)}>
      <FileTypeIcon name={url} className={s.fileIcon} />
      <span className={s.fileName}>{label || url.split("/").pop()}</span>
    </button>
  );
}

function Row({ lab, val }: { lab: string; val: string }) {
  return (
    <div className={s.row}>
      <span className={s.lab}>{lab}</span>
      <span className={s.val}>{val}</span>
    </div>
  );
}

interface Props {
  order: Order | null;
  onClose: () => void;
}

export function ArchiveOrderSheet({ order, onClose }: Props) {
  const docs = order
    ? [
        ...[order.documents.technical, order.documents.contract, order.documents.company].flatMap(
          (urls, i) => urls.map((url) => ({ url, label: DOC_LABELS[i] })),
        ),
        ...order.documents.other.map((url) => ({ url, label: "" })),
      ]
    : [];
  const executorPeriod = order
    ? [order.executor_proposed_start_date, order.executor_proposed_deadline].filter(Boolean).join(" — ")
    : "";

  return (
    <BottomSheet open={order !== null} full title="Архивный заказ" onClose={onClose}>
      {order && (
        <>
          <div className={s.hero}>
            <ThemedImage
              light="/respond-order/archieve-light.webp"
              dark="/respond-order/archieve-dark.webp"
            />
          </div>

          <span className={s.title}>{order.title}</span>

          <div className={s.section}>
            <Row lab="Начальная максимальная цена" val={order.sum || "—"} />
            <Row lab="Срок начала выполнения работ" val={order.start_date || "—"} />
            <Row lab="Срок окончания выполнения работ" val={order.date || "—"} />
            <Row lab="Организатор" val={order.company || "—"} />
            {order.customer_inn && <Row lab="ИНН" val={order.customer_inn} />}
          </div>

          {order.badges.length > 0 && (
            <>
              <span className={s.sectionLab}>Требования к эксперту</span>
              <div className={s.chips}>
                {order.badges.map((b, i) => (
                  <span key={i} className={s.chip}>
                    {b.text}
                  </span>
                ))}
              </div>
            </>
          )}

          {order.comment && (
            <>
              <span className={s.sectionLab}>Комментарий заказчика</span>
              <p className={s.text}>{order.comment}</p>
            </>
          )}

          {order.executor_name && (
            <>
              <span className={s.sectionLab}>Исполнитель</span>
              <div className={s.section}>
                <Row lab="Исполнитель" val={order.executor_name} />
                {order.executor_rating !== null && order.executor_review_count > 0 && (
                  <Row
                    lab="Рейтинг"
                    val={`${order.executor_rating.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} · ${order.executor_review_count} ${pluralRu(order.executor_review_count, "отзыв", "отзыва", "отзывов")}`}
                  />
                )}
                {order.executor_proposed_sum && <Row lab="Цена исполнителя" val={order.executor_proposed_sum} />}
                {executorPeriod && <Row lab="Сроки исполнителя" val={executorPeriod} />}
              </div>
            </>
          )}

          {order.executor_comment && (
            <>
              <span className={s.sectionLab}>Комментарий исполнителя</span>
              <p className={s.text}>{order.executor_comment}</p>
            </>
          )}

          {order.executor_files.length > 0 && (
            <>
              <span className={s.sectionLab}>Файлы отклика</span>
              {order.executor_files.map((url) => (
                <FileRow key={url} url={url} />
              ))}
            </>
          )}

          {docs.length > 0 && (
            <>
              <span className={s.sectionLab}>Документы заказчика</span>
              {docs.map((d) => (
                <FileRow key={d.url} url={d.url} label={d.label} />
              ))}
            </>
          )}
        </>
      )}
    </BottomSheet>
  );
}
