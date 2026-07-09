import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { TextInput, CalendarInput } from "@/source/shared/ui";
import { useSession } from "@/source/features/session";
import type { OrderFormValues } from "../../../model/schema";
import base from "./sectionBase.module.scss";
import s from "./detailsSection.module.scss";

interface Props {
  form: UseFormReturn<OrderFormValues>;
}

export function DetailsSection({ form }: Props) {
  const { watch, setValue } = form;
  const { user } = useSession();
  const companyFromProfile = user?.company_data?.value ?? "";

  useEffect(() => {
    if (companyFromProfile && watch("company") !== companyFromProfile) {
      setValue("company", companyFromProfile, { shouldDirty: false });
    }
  }, [companyFromProfile, setValue, watch]);

  return (
    <section className={base.section}>
      <div className={s.grid}>
        <div className={s.field}>
          <span className={base.label}>Название заказа</span>
          <TextInput
            active
            placeholder="Введите название"
            value={watch("title")}
            onChange={(event) => setValue("title", event.target.value, { shouldDirty: true })}
          />
        </div>

        <div className={s.field}>
          <span className={base.label}>Компания</span>
          <TextInput
            placeholder="Название компании"
            value={watch("company")}
            onChange={(event) => setValue("company", event.target.value, { shouldDirty: true })}
            disabled
          />
        </div>

        <div className={s.field}>
          <span className={base.label}>Срок начала выполнения работ</span>
          <CalendarInput
            active
            value={watch("startDate")}
            onChange={(value) => setValue("startDate", value, { shouldDirty: true })}
          />
        </div>

        <div className={s.field}>
          <span className={base.label}>Срок окончания выполнения работ</span>
          <CalendarInput
            active
            value={watch("deadline")}
            onChange={(value) => setValue("deadline", value, { shouldDirty: true })}
          />
        </div>

        <div className={s.field}>
          <span className={base.label}>Начальная максимальная цена, ₽</span>
          <TextInput
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
          <span className={s.timezoneHint}>Время указано по МСК</span>
        </div>
      </div>
    </section>
  );
}
