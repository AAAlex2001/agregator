import type { FormEvent } from "react";
import { CompanySuggestInput } from "@/entities/company";
import { OrderSummaryPanel } from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { ResponseFilesField, VatKindField } from "@/entities/response";
import { Button } from "@/shared/ui/button";
import { CalendarInput } from "@/shared/ui/calendar-input";
import { TextInput } from "@/shared/ui/text-input";
import type { RespondForm } from "../../model/types";
import { StepHeader } from "../step-header";
import styles from "./style.module.scss";

/** Заказ, черновик предложения и возврат к подтверждению условий. */
interface OfferStepProps {
  order: OrderListItem;
  form: RespondForm;
  onBack: () => void;
}

/** Собирает сроки, стоимость, реквизиты и документы предложения исполнителя. */
export function OfferStep({ order, form, onBack }: OfferStepProps) {
  const { fields } = form;

  /** Передаёт предложение на проверку без перезагрузки страницы. */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    form.submit();
  }

  return (
    <form
      onSubmit={submit}
      className={styles.step}
    >
      <StepHeader step="Шаг 2. Дополнение заявки" />
      <OrderSummaryPanel order={order} />

      <div className={styles.formRow}>
        <div className={styles.field}>
          <span className={styles.label}>Срок начала выполнения работ</span>
          <CalendarInput
            active
            value={fields.startDate}
            onChange={(value) => form.changeField("startDate", value)}
            placeholder="Выберите дату"
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Срок окончания выполнения работ</span>
          <CalendarInput
            active
            value={fields.deadline}
            onChange={(value) => form.changeField("deadline", value)}
            placeholder="Выберите дату"
          />
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Ваша оценка стоимости работ</span>
        <TextInput
          active
          required
          inputMode="numeric"
          value={fields.cost}
          onChange={(event) => form.changeCost(event.target.value)}
          placeholder="Сумма в рублях"
        />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>НДС</span>
        <VatKindField
          value={fields.vatKind}
          baseAmount={Number(fields.cost) || 0}
          onChange={form.changeVatKind}
        />
      </div>

      <span className={styles.formHint}>
        Указанная вами сумма является ориентировочной. Точная стоимость будет
        согласована с заказчиком после изучения технического задания.
      </span>

      {order.requires_license && (
        <div className={styles.field}>
          <span className={styles.label}>
            Организация, от которой подаёте заявку для последующего заключения договора:
          </span>
          <CompanySuggestInput
            value={fields.companyName}
            onChange={form.changeCompany}
            placeholder="ИНН или название компании"
          />
        </div>
      )}

      <div className={styles.field}>
        <span className={styles.label}>Комментарий для заказчика</span>
        <textarea
          className={styles.textarea}
          value={fields.comment}
          onChange={(event) => form.changeField("comment", event.target.value)}
          placeholder="Напишите комментарий для заказчика..."
          maxLength={5000}
        />
      </div>

      <ResponseFilesField
        items={form.files}
        onAdd={form.addFiles}
      />

      <div className={styles.actionRow}>
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={onBack}
        >
          Назад
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          fullWidth
          isLoading={form.isSubmitting}
        >
          Подать заявку
        </Button>
      </div>
    </form>
  );
}
