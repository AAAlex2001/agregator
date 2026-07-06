import { useEffect, useState } from "react";
import { preloadThemedImages } from "@/shared/lib/preload-images";
import { Button, FullSheet, SheetHero } from "@/shared/ui";
import { CalendarPicker } from "@/shared/ui/calendar-picker";
import { useCreateOrder, type StepKey } from "../model/use-create-order";
import { DetailsStep, type DateField } from "./steps/details-step";
import { RequirementsStep } from "./steps/requirements-step";
import { DocsStep } from "./steps/docs-step";
import { ConfirmStep } from "./steps/confirm-step";
import s from "./create-order-sheet.module.scss";

type StepMeta = { image: string; title: string; desc: string };

const META: Record<StepKey, StepMeta> = {
  details: { image: "step-1", title: "Новый заказ", desc: "Название, цена и сроки" },
  requirements: { image: "step-2", title: "Требования", desc: "Кто нужен и области аттестации" },
  docs: { image: "step-3", title: "Документы", desc: "Комментарий и файлы заказа" },
  confirm: { image: "step-4", title: "Проверка", desc: "Всё верно — публикуем" },
};

const SUCCESS_META: StepMeta = { image: "success", title: "Заказ опубликован", desc: "Эксперты уже видят его в ленте" };

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateOrderSheet({ open, onClose, onCreated }: Props) {
  const { state, dispatch, stepKey, total, stepReady, badgeCodes, company, next, back, setFile, addOther } =
    useCreateOrder(open, onCreated);
  const [calField, setCalField] = useState<DateField | null>(null);

  useEffect(() => {
    if (!open) return;
    setCalField(null);
    preloadThemedImages([...Object.values(META), SUCCESS_META].map((m) => m.image), "/create-order");
  }, [open]);

  const meta = state.done ? SUCCESS_META : META[stepKey];
  const filesCount = [state.files.technical, state.files.contract, state.files.company].filter(Boolean).length + state.otherFiles.length;

  return (
    <FullSheet
      open={open}
      onClose={onClose}
      scrollKey={state.done ? "done" : state.step}
      hero={
        <SheetHero
          key={meta.image}
          light={`/create-order/${meta.image}-light.webp`}
          dark={`/create-order/${meta.image}-dark.webp`}
          label={state.done ? "Готово" : `Шаг ${state.step} из ${total}`}
          title={meta.title}
          desc={meta.desc}
          step={state.done ? undefined : state.step}
          total={state.done ? undefined : total}
          onClose={onClose}
        />
      }
    >
      <div className={s.body}>
        {state.done ? (
          <div className={s.success}>
            <p className={s.successTitle}>Заказ опубликован!</p>
            <p className={s.successSub}>
              Эксперты увидят заявку «{state.title.trim()}» и смогут откликнуться. Отклики придут в бота
            </p>
          </div>
        ) : (
          <>
            {stepKey === "details" && (
              <DetailsStep state={state} dispatch={dispatch} company={company} onOpenDate={setCalField} />
            )}
            {stepKey === "requirements" && (
              <RequirementsStep state={state} dispatch={dispatch} badgeCodes={badgeCodes} />
            )}
            {stepKey === "docs" && (
              <DocsStep state={state} dispatch={dispatch} onSetFile={setFile} onAddOther={addOther} />
            )}
            {stepKey === "confirm" && (
              <ConfirmStep state={state} dispatch={dispatch} badgeCodes={badgeCodes} company={company} filesCount={filesCount} />
            )}
          </>
        )}

        <div className={s.actions}>
          {state.done ? (
            <Button onClick={onClose}>Готово</Button>
          ) : (
            <>
              {state.step > 1 && (
                <Button variant="outline" onClick={back} disabled={state.busy}>
                  Назад
                </Button>
              )}
              <Button onClick={next} loading={state.busy} disabled={!stepReady[stepKey]}>
                {stepKey === "confirm" ? "Опубликовать заказ" : "Далее"}
              </Button>
            </>
          )}
        </div>

        <CalendarPicker
          open={calField !== null}
          value={calField ? state[calField] : ""}
          onClose={() => setCalField(null)}
          onApply={(date) => {
            if (calField) dispatch({ type: "set", key: calField, value: date });
          }}
        />
      </div>
    </FullSheet>
  );
}
