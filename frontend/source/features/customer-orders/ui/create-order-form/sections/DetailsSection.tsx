import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/shared/ui";
import { CalendarInput } from "@/source/shared/ui";
import type { OrderFormValues } from "../../../model/schema";
import base from "./sectionBase.module.scss";
import s from "./detailsSection.module.scss";

interface Props {
  form: UseFormReturn<OrderFormValues>;
}

export function DetailsSection({ form }: Props) {
  const { watch, setValue } = form;

  return (
    <section className={base.section}>
      <div className={s.grid}>
        <div className={s.field}>
          <span className={base.label}>Название заказа</span>
          <Input
            variant="text"
            active
            placeholder="Введите название"
            value={watch("title")}
            onChange={(event) => setValue("title", event.target.value, { shouldDirty: true })}
          />
        </div>

        <div className={s.field}>
          <span className={base.label}>Компания</span>
          <Input
            variant="text"
            active
            placeholder="Название компании"
            value={watch("company")}
            onChange={(event) => setValue("company", event.target.value, { shouldDirty: true })}
          />
        </div>

        <div className={s.field}>
          <span className={base.label}>Срок выполнения</span>
          <CalendarInput
            active
            value={watch("deadline")}
            onChange={(value) => setValue("deadline", value, { shouldDirty: true })}
          />
        </div>

        <div className={s.field}>
          <span className={base.label}>Бюджет проекта, ₽</span>
          <Input
            variant="text"
            active
            placeholder="Сумма в рублях (0 — не определено)"
            value={watch("budget")}
            onChange={(event) => setValue("budget", event.target.value.replace(/[^\d]/g, ""), { shouldDirty: true })}
          />
        </div>

        <div className={s.field}>
          <span className={base.label}>Приём откликов до</span>
          <CalendarInput
            active
            value={watch("responsesDeadline")}
            onChange={(value) => setValue("responsesDeadline", value, { shouldDirty: true })}
            withTime
          />
        </div>
      </div>
    </section>
  );
}