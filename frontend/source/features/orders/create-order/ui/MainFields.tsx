import type { OrderWorkType } from "@/source/entities/order";
import { CalendarInput } from "@/source/shared/ui/CalendarInput";
import { TextInput } from "@/source/shared/ui/Inputs";
import type { OrderFormProps } from "../model/types";
import { FormSection } from "./FormSection";
import s from "./MainFields.module.scss";

const TITLE_LABELS: Partial<Record<OrderWorkType, string>> = {
  RESEARCH: "Тема",
  CADASTRAL: "Наименование работы",
  FORENSIC: "Наименование экспертизы",
  LABORATORY: "Наименование исследований",
};

/** Название, компания, сроки, цена и дедлайн откликов. */
export function MainFields({ state, dispatch }: OrderFormProps) {
  return (
    <FormSection>
      <div className={s.grid}>
        <div className={s.field}>
          <span className={s.label}>{TITLE_LABELS[state.workType] ?? "Название заказа"}</span>
          <TextInput
            required
            placeholder="Введите название"
            value={state.title}
            onChange={(event) => dispatch({ type: "field", field: "title", value: event.target.value })}
          />
        </div>
        <div className={s.field}>
          <span className={s.label}>Компания</span>
          <TextInput placeholder="Название компании" value={state.company} disabled />
        </div>
        <div className={s.field}>
          <span className={s.label}>Срок начала выполнения работ</span>
          <CalendarInput active value={state.startDate} onChange={(value) => dispatch({ type: "field", field: "startDate", value })} />
        </div>
        <div className={s.field}>
          <span className={s.label}>Срок окончания выполнения работ</span>
          <CalendarInput active value={state.deadline} onChange={(value) => dispatch({ type: "field", field: "deadline", value })} />
        </div>
        <div className={s.field}>
          <span className={s.label}>Начальная максимальная цена, ₽</span>
          <TextInput
            placeholder="Сумма в рублях (0 — не определено)"
            inputMode="numeric"
            value={state.budget}
            onChange={(event) => dispatch({ type: "field", field: "budget", value: event.target.value.replace(/\D/g, "") })}
          />
        </div>
        <div className={s.field}>
          <span className={s.label}>Приём откликов до</span>
          <CalendarInput
            active
            withTime
            value={state.responsesDeadline}
            onChange={(value) => dispatch({ type: "field", field: "responsesDeadline", value })}
          />
          <span className={s.timezoneHint}>Время указано по МСК</span>
        </div>
      </div>
    </FormSection>
  );
}
