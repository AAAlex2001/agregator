import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import { formatDateRu } from "@/shared/lib/format";
import { Field, TextField } from "@/shared/ui";
import { ChevronDownIcon } from "@/shared/ui/icons/interface";
import { type StepProps } from "./types";
import s from "./details-step.module.scss";

export type DateField = "startDate" | "deadline" | "responsesDeadline";

interface Props extends StepProps {
  company: string;
  onOpenDate: (field: DateField) => void;
}

export function DetailsStep({ state, dispatch, company, onOpenDate }: Props) {
  const dateButton = (field: DateField, value: string) => (
    <button
      type="button"
      className={cn(s.control, s.dateBtn, { [s.dateEmpty]: !value })}
      onClick={() => {
        tapHaptic();
        onOpenDate(field);
      }}
    >
      {value ? formatDateRu(value) : "Выберите дату"}
      <ChevronDownIcon className={s.chev} />
    </button>
  );

  return (
    <>
      <TextField
        label="Название заказа"
        placeholder="Введите название"
        value={state.title}
        onChange={(e) => dispatch({ type: "set", key: "title", value: e.target.value })}
      />

      {company && (
        <Field label="Компания">
          <div className={cn(s.control, s.readonly)}>{company}</div>
        </Field>
      )}

      <TextField
        label="Начальная максимальная цена, ₽"
        inputMode="numeric"
        placeholder="Сумма в рублях (0 — не определено)"
        value={state.sum}
        onChange={(e) => dispatch({ type: "set", key: "sum", value: e.target.value.replace(/\D/g, "") })}
      />

      <Field label="Срок начала выполнения работ">{dateButton("startDate", state.startDate)}</Field>
      <Field label="Срок окончания выполнения работ">{dateButton("deadline", state.deadline)}</Field>
      <Field label="Приём откликов до (необязательно)" hint="Отклики принимаются до конца выбранного дня">
        {dateButton("responsesDeadline", state.responsesDeadline)}
      </Field>
    </>
  );
}
