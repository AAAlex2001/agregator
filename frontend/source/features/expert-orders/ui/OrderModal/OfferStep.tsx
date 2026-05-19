import type { UseFormReturn } from "react-hook-form";
import { Button, CalendarInput, TextInput } from "@/source/shared/ui";
import type { OrderCardData } from "@/source/entities/order";
import type { VatKind } from "@/source/entities/response";
import { VAT_LABEL, VatBreakdown } from "@/source/entities/response";
import { PartySuggestInput, type PartySuggestion } from "@/source/features/party-suggest";
import { VAT_KIND_VALUES, type RespondFormValues } from "../../model/respond.schema";
import base from "./sectionBase.module.scss";
import { BidFilesField } from "./BidFilesField";
import { ModalHeader } from "./ModalHeader";
import { OrderSummaryPanel } from "./OrderSummaryPanel";
import s from "./OfferStep.module.scss";

interface Props {
  order: OrderCardData;
  form: UseFormReturn<RespondFormValues>;
  files: File[];
  isSubmitting: boolean;
  onAddFiles: (files: FileList | null) => void;
  onRemoveFile: (index: number) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function OfferStep({
  order,
  form,
  files,
  isSubmitting,
  onAddFiles,
  onRemoveFile,
  onBack,
  onSubmit,
}: Props) {
  const { watch, setValue, formState } = form;
  const shouldValidate = formState.isSubmitted;
  const startDate = watch("startDate");
  const deadline = watch("deadline");
  const cost = watch("cost");
  const vatKind = watch("vatKind");
  const comment = watch("comment");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={base.section}>
      <ModalHeader title="Отклик на заказ" step="Шаг 2. Дополнение заявки" />
      <OrderSummaryPanel order={order} />

      <div className={s.formRow}>
        <div className={base.fieldGroup}>
          <span className={base.fieldLabel}>Срок начала работ</span>
          <CalendarInput
            active
            value={startDate}
            onChange={(value) => setValue("startDate", value, { shouldValidate })}
            placeholder="Выберите дату"
            error={formState.errors.startDate?.message}
          />
        </div>

        <div className={base.fieldGroup}>
          <span className={base.fieldLabel}>Срок окончания работ</span>
          <CalendarInput
            active
            value={deadline}
            onChange={(value) => setValue("deadline", value, { shouldValidate })}
            placeholder="Выберите дату"
            error={formState.errors.deadline?.message}
          />
        </div>

        <div className={base.fieldGroup}>
          <span className={base.fieldLabel}>Ваша оценка стоимости работ</span>
          <TextInput
            active
            inputMode="numeric"
            value={cost}
            onChange={(event) =>
              setValue("cost", event.target.value.replace(/[^0-9]/g, ""), { shouldValidate })
            }
            placeholder="Сумма в рублях"
            error={formState.errors.cost?.message}
          />
        </div>
      </div>

      <div className={base.fieldGroup}>
        <span className={base.fieldLabel}>НДС</span>
        <div className={s.vatGroup} role="radiogroup" aria-label="НДС">
          {VAT_KIND_VALUES.map((kind) => {
            const active = vatKind === kind;
            return (
              <button
                key={kind}
                type="button"
                role="radio"
                aria-checked={active}
                className={`${s.vatChip} ${active ? s.vatChipActive : ""}`.trim()}
                onClick={() => setValue("vatKind", kind as VatKind, { shouldValidate })}
              >
                {VAT_LABEL[kind as VatKind]}
              </button>
            );
          })}
        </div>
        <VatBreakdown baseAmount={Number(cost) || 0} vatKind={vatKind as VatKind} />
      </div>

      <span className={s.formHint}>
        Указанная вами сумма является ориентировочной. Точная стоимость будет согласована с заказчиком после изучения технического задания.
      </span>

      <div className={base.fieldGroup}>
        <span className={base.fieldLabel}>
          Организация, от которой подаёте заявку для последующего заключения договора:
        </span>
        <PartySuggestInput
          value={watch("companyName")}
          onChange={(query: string, picked: PartySuggestion | null) => {
            setValue("companyName", picked?.value ?? query, { shouldValidate });
            setValue("companyData", picked, { shouldValidate });
          }}
          placeholder="ИНН или название компании"
          error={formState.errors.companyName?.message as string | undefined}
        />
      </div>

      <div className={s.textareaGroup}>
        <span className={base.fieldLabel}>Комментарий для заказчика</span>
        <textarea
          className={s.textarea}
          value={comment}
          onChange={(event) => setValue("comment", event.target.value, { shouldValidate })}
          placeholder="Напишите комментарий для заказчика..."
          maxLength={5000}
        />
      </div>

      <BidFilesField files={files} onAddFiles={onAddFiles} onRemoveFile={onRemoveFile} />

      <div className={base.actionRow}>
        <Button variant="outline" size="sm" fullWidth onClick={onBack}>
          Назад
        </Button>
        <Button type="submit" variant="primary" size="sm" fullWidth isLoading={isSubmitting}>
          Подать заявку
        </Button>
      </div>
    </form>
  );
}
