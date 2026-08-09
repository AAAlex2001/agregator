import { TextInput, CalendarInput } from "@/source/shared/ui";
import type { OrderWorkType } from "@/source/entities/order";
import type { StepProps } from "./types";
import base from "./sectionBase.module.scss";
import s from "./detailsSection.module.scss";

const TITLE_LABELS: Partial<Record<OrderWorkType, string>> = {
  RESEARCH: "Тема",
  CADASTRAL: "Наименование работы",
  FORENSIC: "Наименование экспертизы",
  LABORATORY: "Наименование исследований",
};

export function DetailsSection({ state, dispatch }: StepProps) {
  return (
    <section className={base.section}>
      <div className={s.grid}>
        <div className={s.field}>
          <span className={base.label}>{TITLE_LABELS[state.workType] ?? "Название заказа"}</span>
          <TextInput
            active
            required
            placeholder="Введите название"
            value={state.title}
            onChange={(e) => dispatch({ type: "set", key: "title", value: e.target.value })}
          />
        </div>

        <div className={s.field}>
          <span className={base.label}>Компания</span>
          <TextInput
            placeholder="Название компании"
            value={state.company}
            onChange={(e) => dispatch({ type: "set", key: "company", value: e.target.value })}
            disabled
          />
        </div>

        <div className={s.field}>
          <span className={base.label}>Срок начала выполнения работ</span>
          <CalendarInput
            active
            value={state.startDate}
            onChange={(value) => dispatch({ type: "set", key: "startDate", value })}
          />
        </div>

        <div className={s.field}>
          <span className={base.label}>Срок окончания выполнения работ</span>
          <CalendarInput
            active
            value={state.deadline}
            onChange={(value) => dispatch({ type: "set", key: "deadline", value })}
          />
        </div>

        <div className={s.field}>
          <span className={base.label}>Начальная максимальная цена, ₽</span>
          <TextInput
            active
            placeholder="Сумма в рублях (0 — не определено)"
            value={state.budget}
            onChange={(e) => dispatch({ type: "set", key: "budget", value: e.target.value.replace(/[^\d]/g, "") })}
          />
        </div>

        <div className={s.field}>
          <span className={base.label}>Приём откликов до</span>
          <CalendarInput
            active
            value={state.responsesDeadline}
            onChange={(value) => dispatch({ type: "set", key: "responsesDeadline", value })}
            withTime
          />
          <span className={s.timezoneHint}>Время указано по МСК</span>
        </div>
      </div>
    </section>
  );
}
