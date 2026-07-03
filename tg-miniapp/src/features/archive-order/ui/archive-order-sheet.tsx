import { useEffect, useState } from "react";
import { Button, FullSheet, SheetHero } from "@/shared/ui";
import { FileTypeIcon } from "@/shared/ui/file-icon";
import { fileName, openFile } from "@/shared/lib/files";
import { pluralRu } from "@/shared/lib/format";
import { tapHaptic } from "@/shared/services/telegram";
import type { Order } from "@/entites/order";
import s from "./archive-order-sheet.module.scss";

type StepKey = "order" | "customer" | "executor" | "docs";

const META: Record<StepKey, { title: string; desc: string; image: string }> = {
  order: { title: "Заказ", desc: "Условия и требования", image: "archieve" },
  customer: { title: "Заказчик", desc: "Кто разместил заявку", image: "step-1" },
  executor: { title: "Исполнитель", desc: "Кто выполнил заказ", image: "step-4" },
  docs: { title: "Документы", desc: "Вложения заказчика", image: "step-2" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={s.row}>
      <span className={s.rowLab}>{label}</span>
      <span className={s.rowVal}>{value}</span>
    </div>
  );
}

function FileRow({ url }: { url: string }) {
  return (
    <button type="button" className={s.fileRow} onClick={() => openFile(url)}>
      <FileTypeIcon name={url} className={s.fileIcon} />
      <span className={s.fileName}>{fileName(url)}</span>
    </button>
  );
}

interface Props {
  order: Order | null;
  onClose: () => void;
}

export function ArchiveOrderSheet({ order, onClose }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!order) return;
    setStep(0);
    for (const { image } of Object.values(META)) {
      for (const theme of ["light", "dark"]) {
        const img = new Image();
        img.src = `/respond-order/${image}-${theme}.webp`;
      }
    }
  }, [order]);

  const docs = order
    ? [...order.documents.technical, ...order.documents.contract, ...order.documents.company, ...order.documents.other]
    : [];

  const keys: StepKey[] = [];
  if (order) {
    keys.push("order", "customer");
    if (order.executor_name) keys.push("executor");
    if (docs.length) keys.push("docs");
  }
  const total = keys.length;
  const current = keys[step] ?? "order";
  const meta = META[current];

  const close = () => {
    tapHaptic();
    onClose();
  };

  const footer = (
    <>
      {step > 0 && (
        <Button variant="outline" onClick={() => setStep(step - 1)}>
          Назад
        </Button>
      )}
      {step < total - 1 ? (
        <Button onClick={() => setStep(step + 1)}>Далее</Button>
      ) : (
        <Button onClick={close}>Готово</Button>
      )}
    </>
  );

  return (
    <FullSheet
      open={order !== null}
      onClose={close}
      scrollKey={step}
      hero={
        <SheetHero
          key={current}
          light={`/respond-order/${meta.image}-light.webp`}
          dark={`/respond-order/${meta.image}-dark.webp`}
          label={`Шаг ${step + 1} из ${total}`}
          title={meta.title}
          desc={meta.desc}
          step={step + 1}
          total={total}
          onClose={close}
        />
      }
      footer={footer}
    >
      {order && (
        <div className={s.body}>
          {current === "order" && (
            <>
              <div className={s.header}>
                <h2 className={s.orderTitle}>{order.title}</h2>
                <span className={s.sum}>{order.sum}</span>
              </div>
              {order.badges.length > 0 && (
                <div className={s.chips}>
                  {order.badges.map((b, i) => (
                    <span key={i} className={s.chip}>
                      {b.text}
                    </span>
                  ))}
                </div>
              )}
              <Row label="Начало работ" value={order.start_date || "—"} />
              <Row label="Окончание работ" value={order.deadline_at || "—"} />
            </>
          )}

          {current === "customer" && (
            <>
              <Row label="Организация" value={order.customer_name || "—"} />
              {order.customer_inn && <Row label="ИНН" value={order.customer_inn} />}
              {order.comment && <p className={s.text}>{order.comment}</p>}
            </>
          )}

          {current === "executor" && (
            <>
              <div className={s.execHead}>
                <span className={s.execName}>{order.executor_name}</span>
                {order.executor_rating !== null && (
                  <span className={s.rating}>
                    ★ {order.executor_rating.toFixed(1)} · {order.executor_review_count}{" "}
                    {pluralRu(order.executor_review_count, "отзыв", "отзыва", "отзывов")}
                  </span>
                )}
              </div>
              <Row label="Стоимость" value={order.executor_proposed_sum || "—"} />
              <Row label="Начало" value={order.executor_proposed_start_date || "—"} />
              <Row label="Окончание" value={order.executor_proposed_deadline || "—"} />
              {order.executor_comment && <p className={s.text}>{order.executor_comment}</p>}
              {order.executor_files.length > 0 && (
                <div className={s.files}>
                  {order.executor_files.map((url) => (
                    <FileRow key={url} url={url} />
                  ))}
                </div>
              )}
            </>
          )}

          {current === "docs" && (
            <div className={s.files}>
              {docs.map((url) => (
                <FileRow key={url} url={url} />
              ))}
            </div>
          )}
        </div>
      )}
    </FullSheet>
  );
}
