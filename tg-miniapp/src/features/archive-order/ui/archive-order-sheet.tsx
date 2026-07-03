import { useEffect, useState } from "react";
import { Button, FullSheet, SheetHero } from "@/shared/ui";
import { FileTypeIcon } from "@/shared/ui/file-icon";
import { ExpertIcon, StarIcon } from "@/shared/ui/icons/expert";
import { fileName, openFile } from "@/shared/lib/files";
import { pluralRu } from "@/shared/lib/format";
import { tapHaptic } from "@/shared/services/telegram";
import { OrderInfo, type Order } from "@/entites/order";
import { useArchiveOrder } from "../model/use-archive-order";
import s from "./archive-order-sheet.module.scss";

type StepKey = "order" | "docs" | "questions" | "executor";

const META: Record<StepKey, { title: string; desc: string; image: string }> = {
  order: { title: "Информация по заказу", desc: "Условия завершённого заказа", image: "archieve" },
  docs: { title: "Документы заказчика", desc: "Вложения по заказу", image: "step-2" },
  questions: { title: "Вопросы по заказу", desc: "Переписка с заказчиком", image: "step-3" },
  executor: { title: "Исполнитель", desc: "Кто выполнил заказ", image: "step-4" },
};

function FileRow({ url }: { url: string }) {
  return (
    <button type="button" className={s.fileRow} onClick={() => openFile(url)}>
      <FileTypeIcon name={url} className={s.fileIcon} />
      <span className={s.fileName}>{fileName(url)}</span>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={s.row}>
      <span className={s.rowLab}>{label}</span>
      <span className={s.rowVal}>{value}</span>
    </div>
  );
}

interface Props {
  order: Order | null;
  onClose: () => void;
}

export function ArchiveOrderSheet({ order, onClose }: Props) {
  const [step, setStep] = useState(0);
  const { questions } = useArchiveOrder(order);

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
    keys.push("order");
    if (docs.length > 0) keys.push("docs");
    if (questions && questions.length > 0) keys.push("questions");
    if (order.executor_name) keys.push("executor");
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
          {current === "order" && <OrderInfo order={order} />}

          {current === "docs" && (
            <div className={s.group}>
              <span className={s.blockLab}>Документы заказчика</span>
              <div className={s.files}>
                {docs.map((url) => (
                  <FileRow key={url} url={url} />
                ))}
              </div>
            </div>
          )}

          {current === "questions" && (
            <div className={s.group}>
              <span className={s.blockLab}>Вопросы по заказу</span>
              <div className={s.qaList}>
                {(questions ?? []).map((q) => (
                  <div key={q.id} className={s.qaItem}>
                    <p className={s.qaQuestion}>{q.question}</p>
                    <p className={s.qaAnswer}>{q.answer ? q.answer : "Заказчик не ответил"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {current === "executor" && (
            <div className={s.group}>
              <div className={s.execHead}>
                <span className={s.execAvatar}>
                  <ExpertIcon size={30} />
                </span>
                <div className={s.execIdentity}>
                  <span className={s.execName}>{order.executor_name}</span>
                  {order.executor_rating !== null && (
                    <span className={s.execRating}>
                      <StarIcon className={s.star} /> {order.executor_rating.toFixed(1)} ·{" "}
                      {order.executor_review_count}{" "}
                      {pluralRu(order.executor_review_count, "отзыв", "отзыва", "отзывов")}
                    </span>
                  )}
                </div>
              </div>

              <div className={s.block}>
                <Row label="Стоимость" value={order.executor_proposed_sum || "—"} />
                <Row label="Начало работ" value={order.executor_proposed_start_date || "—"} />
                <Row label="Окончание" value={order.executor_proposed_deadline || "—"} />
              </div>

              {order.executor_comment && (
                <div className={s.commentBlock}>
                  <p className={s.comment}>{order.executor_comment}</p>
                </div>
              )}

              {order.executor_files.length > 0 && (
                <div className={s.files}>
                  {order.executor_files.map((url) => (
                    <FileRow key={url} url={url} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </FullSheet>
  );
}
