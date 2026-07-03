import { useEffect, useState } from "react";
import { tapHaptic } from "@/shared/services/telegram";
import { Button, FullSheet, SheetHero } from "@/shared/ui";
import { CalendarPicker } from "@/shared/ui/calendar-picker";
import type { Order } from "@/entites/order";
import { useRespondForm } from "../model/use-respond-form";
import { InfoStep } from "./steps/info-step";
import { DocumentsStep } from "./steps/documents-step";
import { QuestionsStep } from "./steps/questions-step";
import { ConfirmStep } from "./steps/confirm-step";
import { OfferStep } from "./steps/offer-step";
import s from "./respond-sheet.module.scss";

const TOTAL = 5;
type StepMeta = { image: string; label: string; title: string; desc: string };

const META: Record<number, StepMeta> = {
  1: { image: "step-1", label: "Шаг 1 из 5", title: "Информация по заказу", desc: "Изучите условия перед откликом" },
  2: { image: "step-2", label: "Шаг 2 из 5", title: "Документы заказчика", desc: "ТЗ, договор и другие вложения" },
  3: { image: "step-3", label: "Шаг 3 из 5", title: "Вопросы по заказу", desc: "Уточните детали у заказчика" },
  4: { image: "step-4", label: "Шаг 4 из 5", title: "Подтверждение", desc: "Что произойдёт после отклика" },
  5: { image: "step-5", label: "Шаг 5 из 5", title: "Ваше предложение", desc: "Сроки, цена и комментарий" },
};
const SUCCESS_META: StepMeta = { image: "success", label: "Готово", title: "Отклик отправлен", desc: "Ждите ответа в боте" };

interface Props {
  order: Order | null;
  onClose: () => void;
}

export function RespondSheet({ order, onClose }: Props) {
  const open = order !== null;
  const [step, setStep] = useState(1);
  const [calField, setCalField] = useState<"start" | "end" | null>(null);
  const { state, needsCompany, canSubmit, submit, dispatch } = useRespondForm(order);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setCalField(null);
    for (const meta of [...Object.values(META), SUCCESS_META]) {
      for (const theme of ["light", "dark"]) {
        const img = new Image();
        img.src = `/respond-order/${meta.image}-${theme}.webp`;
      }
    }
  }, [open]);

  const close = () => {
    tapHaptic();
    onClose();
  };

  const meta = state.done ? SUCCESS_META : META[step];
  const pinned = step === 1 && !state.done;

  const actions = state.done ? (
    <Button onClick={close}>Готово</Button>
  ) : step === 1 ? (
    <Button onClick={() => setStep(2)}>Далее</Button>
  ) : step === 5 ? (
    <>
      <Button variant="outline" onClick={() => setStep(4)}>Назад</Button>
      <Button disabled={!canSubmit} loading={state.busy} onClick={() => void submit()}>
        Откликнуться
      </Button>
    </>
  ) : (
    <>
      <Button variant="outline" onClick={() => setStep(step - 1)}>Назад</Button>
      <Button onClick={() => setStep(step + 1)}>{step === 4 ? "Продолжить" : "Далее"}</Button>
    </>
  );

  return (
    <FullSheet
      open={open}
      onClose={close}
      scrollKey={state.done ? "done" : step}
      hero={
        <SheetHero
          key={meta.image}
          light={`/respond-order/${meta.image}-light.webp`}
          dark={`/respond-order/${meta.image}-dark.webp`}
          label={meta.label}
          title={meta.title}
          desc={meta.desc}
          step={state.done ? undefined : step}
          total={state.done ? undefined : TOTAL}
          onClose={close}
        />
      }
      footer={pinned ? actions : null}
    >
      {order && (
        <div className={s.body}>
          {state.done ? (
            <div className={s.success}>
              <p className={s.successTitle}>Отклик отправлен!</p>
              <p className={s.successSub}>
                Заказчик увидит ваше предложение по заявке «{order.title}». Ответ придёт в бота
              </p>
            </div>
          ) : step === 1 ? (
            <InfoStep order={order} />
          ) : step === 2 ? (
            <DocumentsStep order={order} />
          ) : step === 3 ? (
            <QuestionsStep orderId={order.id} />
          ) : step === 4 ? (
            <ConfirmStep />
          ) : (
            <OfferStep
              requiresLicense={needsCompany}
              startDate={state.startDate}
              deadline={state.deadline}
              sum={state.sum}
              vat={state.vat}
              comment={state.comment}
              companyName={state.companyName}
              files={state.files}
              onOpenDate={setCalField}
              onChangeSum={(value) => dispatch({ type: "sum", value })}
              onChangeVat={(value) => dispatch({ type: "vat", value })}
              onChangeComment={(value) => dispatch({ type: "comment", value })}
              onCompanyText={(value) => dispatch({ type: "companyText", value })}
              onCompanyPick={(party) => dispatch({ type: "companyPick", party })}
              onAddFiles={(list) => dispatch({ type: "addFiles", files: list ? Array.from(list) : [] })}
              onRemoveFile={(index) => dispatch({ type: "removeFile", index })}
            />
          )}

          {!pinned && <div className={s.actions}>{actions}</div>}

          <CalendarPicker
            open={calField !== null}
            value={calField === "start" ? state.startDate : state.deadline}
            onClose={() => setCalField(null)}
            onApply={(date) =>
              dispatch(calField === "start" ? { type: "startDate", value: date } : { type: "deadline", value: date })
            }
          />
        </div>
      )}
    </FullSheet>
  );
}
