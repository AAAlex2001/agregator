import { useState } from "react";
import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import { BottomSheet, Button, Field, FilePicker, FullSheet, SheetHero, TextArea, TextField, Toggle } from "@/shared/ui";
import { CalendarPicker } from "@/shared/ui/calendar-picker";
import { ChevronDownIcon } from "@/shared/ui/icons/interface";
import { formatDateRu, formatMoscowDateTime } from "@/shared/lib/format";
import type { Order } from "@/entites/order";
import { useEditOrder } from "../model/use-edit-order";
import type { EditOrderField } from "../model/types";
import s from "./edit-order-sheet.module.scss";

type DateField = Extract<EditOrderField, "startDate" | "deadline" | "responsesDeadline">;

const DATE_FIELDS: { key: DateField; label: string }[] = [
  { key: "startDate", label: "Срок начала выполнения работ" },
  { key: "deadline", label: "Срок окончания выполнения работ" },
  { key: "responsesDeadline", label: "Приём откликов до (МСК)" },
];

interface Props {
  order: Order | null;
  onClose: () => void;
  onSaved: () => void;
  copyTemplate?: Order | null;
  onCopy: () => void;
}

export function EditOrderSheet({ order, onClose, onSaved, copyTemplate = null, onCopy }: Props) {
  const [calField, setCalField] = useState<DateField | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { state, dispatch, canSubmit, submit, remove, keptUrls } = useEditOrder(order, onSaved, copyTemplate);

  return (
    <FullSheet
      open={order !== null}
      onClose={onClose}
      hero={
        <SheetHero
          light="/create-order/step-1-light.webp"
          dark="/create-order/step-1-dark.webp"
          label="Редактирование"
          title="Изменить заказ"
          desc="Обновите условия — исполнители увидят изменения"
          onClose={onClose}
        />
      }
    >
      {order && (
        <div className={s.body}>
          <Field label="Название заказа">
            <TextField
              placeholder="Название"
              value={state.title}
              onChange={(e) => dispatch({ type: "set", key: "title", value: e.target.value })}
            />
          </Field>

          <Field label="Начальная цена">
            <TextField
              inputMode="numeric"
              placeholder="Сумма в рублях"
              value={state.sum}
              onChange={(e) => dispatch({ type: "set", key: "sum", value: e.target.value.replace(/\D/g, "") })}
            />
          </Field>

          {DATE_FIELDS.map((field) => (
            <Field key={field.key} label={field.label}>
              <button
                type="button"
                className={cn(s.dateBtn, { [s.dateEmpty]: !state[field.key] })}
                onClick={() => {
                  tapHaptic();
                  setCalField(field.key);
                }}
              >
                {state[field.key]
                  ? field.key === "responsesDeadline"
                    ? formatMoscowDateTime(state[field.key])
                    : formatDateRu(state[field.key])
                  : "Выберите дату"}
                <ChevronDownIcon className={s.chev} width={18} height={18} />
              </button>
            </Field>
          ))}

          <Field label="Комментарий к заказу">
            <TextArea
              placeholder="Опишите детали заказа…"
              value={state.comment}
              onChange={(e) => dispatch({ type: "set", key: "comment", value: e.target.value })}
            />
          </Field>

          <Field label="Документы заказа">
            <FilePicker
              files={state.newFiles}
              onAdd={(list) => dispatch({ type: "addFiles", files: list ? Array.from(list) : [] })}
              onRemove={(index) => dispatch({ type: "removeNew", index })}
              keptUrls={keptUrls}
              onRemoveKept={(url) => dispatch({ type: "removeKeep", url })}
            />
          </Field>

          <Field label="Уведомления">
            <div className={s.notifyRow}>
              <div className={s.notifyText}>
                <span className={s.notifyTitle}>Сообщить откликнувшимся об изменениях</span>
                <span className={s.notifyHint}>Исполнители с откликами получат уведомление</span>
              </div>
              <Toggle
                on={state.notifyResponders}
                onChange={(value) => dispatch({ type: "notifyResponders", value })}
              />
            </div>
          </Field>

          <div className={s.actions}>
            <Button variant="outline" onClick={onCopy}>
              Скопировать
            </Button>
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button disabled={!canSubmit} loading={state.busy} onClick={() => void submit()}>
              Сохранить
            </Button>
          </div>

          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            Удалить заказ
          </Button>

          <BottomSheet open={confirmDelete} title="Удалить заказ?" onClose={() => setConfirmDelete(false)}>
            <div className={s.confirm}>
              <p className={s.confirmHint}>
                Заказ «{state.title}» будет удалён вместе с откликами. Это действие нельзя отменить.
              </p>
              <div className={s.confirmActions}>
                <Button variant="outline" onClick={() => setConfirmDelete(false)}>
                  Отмена
                </Button>
                <Button variant="danger" loading={state.busy} onClick={() => void remove()}>
                  Удалить
                </Button>
              </div>
            </div>
          </BottomSheet>

          <CalendarPicker
            open={calField !== null}
            value={calField ? state[calField] : ""}
            withTime={calField === "responsesDeadline"}
            onClose={() => setCalField(null)}
            onApply={(date) => {
              if (calField) dispatch({ type: "set", key: calField, value: date });
            }}
          />
        </div>
      )}
    </FullSheet>
  );
}
