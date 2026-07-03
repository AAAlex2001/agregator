import { useState } from "react";
import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import { Button, FilePicker, FullSheet, SheetHero } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { CalendarPicker } from "@/shared/ui/calendar-picker";
import { ChevronDownIcon } from "@/shared/ui/icons/interface";
import { formatDateRu, formatRub, toKopecks } from "@/shared/lib/format";
import { VAT_LABEL, type ExpertResponse, type VatKind } from "@/entites/response";
import { useEditResponse } from "../model/use-edit-response";
import s from "./edit-response-sheet.module.scss";

const VAT_OPTIONS: VatKind[] = ["NONE", "VAT_5", "VAT_7", "VAT_22"];
const VAT_RATE: Record<VatKind, number> = { NONE: 0, VAT_5: 5, VAT_7: 7, VAT_22: 22 };

interface Props {
  response: ExpertResponse | null;
  onClose: () => void;
  onSaved: () => void;
}

export function EditResponseSheet({ response, onClose, onSaved }: Props) {
  const [calField, setCalField] = useState<"start" | "end" | null>(null);
  const { state, canSubmit, submit, dispatch } = useEditResponse(response, onSaved);

  const close = () => {
    tapHaptic();
    onClose();
  };

  const base = toKopecks(state.sum);
  const rate = VAT_RATE[state.vat];
  const vatAmount = Math.round((base * rate) / 100);

  return (
    <FullSheet
      open={response !== null}
      onClose={close}
      hero={
        <SheetHero
          light="/respond-order/step-5-light.webp"
          dark="/respond-order/step-5-dark.webp"
          label="Редактирование"
          title="Ваше предложение"
          desc="Измените сроки, цену и файлы"
          onClose={close}
        />
      }
    >
      {response && (
        <div className={s.body}>
          <div className={s.field}>
            <span className={s.fieldLab}>Срок начала выполнения работ</span>
            <button
              type="button"
              className={cn(s.control, s.dateBtn, { [s.dateEmpty]: !state.startDate })}
              onClick={() => {
                tapHaptic();
                setCalField("start");
              }}
            >
              {state.startDate ? formatDateRu(state.startDate) : "Выберите дату"}
              <ChevronDownIcon className={s.chev} />
            </button>
          </div>

          <div className={s.field}>
            <span className={s.fieldLab}>Срок окончания выполнения работ</span>
            <button
              type="button"
              className={cn(s.control, s.dateBtn, { [s.dateEmpty]: !state.deadline })}
              onClick={() => {
                tapHaptic();
                setCalField("end");
              }}
            >
              {state.deadline ? formatDateRu(state.deadline) : "Выберите дату"}
              <ChevronDownIcon className={s.chev} />
            </button>
          </div>

          <div className={s.field}>
            <span className={s.fieldLab}>Ваша оценка стоимости работ</span>
            <input
              className={s.control}
              inputMode="numeric"
              placeholder="Сумма в рублях"
              value={state.sum}
              onFocus={() => tapHaptic()}
              onChange={(e) => dispatch({ type: "sum", value: e.target.value })}
            />
          </div>

          <div className={s.field}>
            <span className={s.fieldLab}>Ставка НДС</span>
            <Tabs
              tabs={VAT_OPTIONS.map((code) => ({ key: code, label: VAT_LABEL[code] }))}
              active={state.vat}
              onChange={(key) => dispatch({ type: "vat", value: key as VatKind })}
            />
            {base > 0 && (
              <div className={s.breakdown}>
                <div className={s.bd}>
                  <span>Стоимость работ</span>
                  <span>{formatRub(base)}</span>
                </div>
                {state.vat !== "NONE" && (
                  <div className={s.bd}>
                    <span>НДС {rate}%</span>
                    <span>{formatRub(vatAmount)}</span>
                  </div>
                )}
                <div className={s.bdTotal}>
                  <span>Итого</span>
                  <span>{formatRub(base + vatAmount)}</span>
                </div>
              </div>
            )}
          </div>

          <div className={s.field}>
            <span className={s.fieldLab}>Комментарий для заказчика</span>
            <textarea
              className={s.textarea}
              placeholder="Напишите комментарий для заказчика…"
              value={state.comment}
              onFocus={() => tapHaptic()}
              onChange={(e) => dispatch({ type: "comment", value: e.target.value })}
            />
          </div>

          <div className={s.field}>
            <span className={s.fieldLab}>Файлы к отклику</span>
            <FilePicker
              files={state.newFiles}
              onAdd={(list) => dispatch({ type: "addFiles", files: list ? Array.from(list) : [] })}
              onRemove={(index) => dispatch({ type: "removeNew", index })}
              keptUrls={state.keepFiles}
              onRemoveKept={(url) => dispatch({ type: "removeKeep", url })}
            />
          </div>

          <div className={s.actions}>
            <Button variant="outline" onClick={close}>
              Отмена
            </Button>
            <Button disabled={!canSubmit} loading={state.busy} onClick={() => void submit()}>
              Сохранить
            </Button>
          </div>

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
