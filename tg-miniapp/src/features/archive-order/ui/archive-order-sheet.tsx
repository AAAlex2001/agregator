import { useEffect, useState } from "react";
import { Button, FullSheet, SheetHero } from "@/shared/ui";
import { tapHaptic } from "@/shared/services/telegram";
import { preloadThemedImages } from "@/shared/lib/preload-images";
import { OrderInfo, type Order } from "@/entites/order";
import { useArchiveOrder } from "../model/use-archive-order";
import { DocsStep } from "./steps/docs-step";
import { QuestionsStep } from "./steps/questions-step";
import { ExecutorStep } from "./steps/executor-step";
import s from "./archive-order-sheet.module.scss";

type StepKey = "order" | "docs" | "questions" | "executor";

const META: Record<StepKey, { title: string; desc: string; image: string }> = {
  order: { title: "Информация по заказу", desc: "Условия завершённого заказа", image: "archieve" },
  docs: { title: "Документы заказчика", desc: "Вложения по заказу", image: "step-2" },
  questions: { title: "Вопросы по заказу", desc: "Переписка с заказчиком", image: "step-3" },
  executor: { title: "Исполнитель", desc: "Кто выполнил заказ", image: "step-4" },
};

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
    preloadThemedImages(Object.values(META).map((m) => m.image), "/respond-order");
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
          {current === "docs" && <DocsStep docs={docs} />}
          {current === "questions" && <QuestionsStep questions={questions ?? []} />}
          {current === "executor" && <ExecutorStep order={order} />}
        </div>
      )}
    </FullSheet>
  );
}
