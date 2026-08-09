import type { Dispatch, FormEvent } from "react";
import { Button, CalendarInput, TextInput } from "@/source/shared/ui";
import type { OrderCardData } from "@/source/entities/order";
import { VAT_LABEL, VatBreakdown } from "@/source/entities/response";
import { PartySuggestInput, type PartySuggestion } from "@/source/features/party-suggest";
import {
  VAT_KIND_VALUES,
  type RespondFormAction,
  type RespondFormState,
} from "../../model/respondForm";
import base from "./sectionBase.module.scss";
import { BidFilesField } from "./BidFilesField";
import { ModalHeader } from "./ModalHeader";
import { OrderSummaryPanel } from "./OrderSummaryPanel";
import s from "./OfferStep.module.scss";

interface Props {
  order: OrderCardData;
  state: RespondFormState;
  dispatch: Dispatch<RespondFormAction>;
  showCompanyField: boolean;
  files: File[];
  isSubmitting: boolean;
  onAddFiles: (files: FileList | null) => void;
  onRemoveFile: (index: number) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function OfferStep({
  order,
  state,
  dispatch,
  showCompanyField,
  files,
  isSubmitting,
  onAddFiles,
  onRemoveFile,
  onBack,
  onSubmit,
}: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={base.section}>
      <ModalHeader title="Отклик на заказ" step="Шаг 2. Дополнение заявки" />
      <OrderSummaryPanel order={order} />

      <div className={s.formRow}>
        <div className={base.fieldGroup}>
          <span className={base.fieldLabel}>Срок начала выполнения работ</span>
          <CalendarInput
            active
            value={state.startDate}
            onChange={(value) => dispatch({ type: "set", field: "startDate", value })}
            placeholder="Выберите дату"
          />
        </div>

        <div className={base.fieldGroup}>
          <span className={base.fieldLabel}>Срок окончания выполнения работ</span>
          <CalendarInput
            active
            value={state.deadline}
            onChange={(value) => dispatch({ type: "set", field: "deadline", value })}
            placeholder="Выберите дату"
          />
        </div>
      </div>

      <div className={base.fieldGroup}>
        <span className={base.fieldLabel}>Ваша оценка стоимости работ</span>
        <TextInput
          active
          required
          inputMode="numeric"
          value={state.cost}
          onChange={(event) => dispatch({ type: "cost", value: event.target.value })}
          placeholder="Сумма в рублях"
        />
      </div>

      <div className={base.fieldGroup}>
        <span className={base.fieldLabel}>НДС</span>
        <div className={s.vatGroup} role="radiogroup" aria-label="НДС">
          {VAT_KIND_VALUES.map((kind) => {
            const active = state.vatKind === kind;
            return (
              <button
                key={kind}
                type="button"
                role="radio"
                aria-checked={active}
                className={`${s.vatChip} ${active ? s.vatChipActive : ""}`.trim()}
                onClick={() => dispatch({ type: "vatKind", value: kind })}
              >
                {VAT_LABEL[kind]}
              </button>
            );
          })}
        </div>
        <VatBreakdown baseAmount={Number(state.cost) || 0} vatKind={state.vatKind} />
      </div>

      <span className={s.formHint}>
        Указанная вами сумма является ориентировочной. Точная стоимость будет согласована с заказчиком после изучения технического задания.
      </span>

      {showCompanyField && (
        <div className={base.fieldGroup}>
          <span className={base.fieldLabel}>
            Организация, от которой подаёте заявку для последующего заключения договора:
          </span>
          <PartySuggestInput
            value={state.companyName}
            onChange={(query: string, picked: PartySuggestion | null) => {
              dispatch({ type: "company", name: picked?.value ?? query, data: picked });
            }}
            placeholder="ИНН или название компании"
          />
        </div>
      )}

      <div className={s.textareaGroup}>
        <span className={base.fieldLabel}>Комментарий для заказчика</span>
        <textarea
          className={s.textarea}
          value={state.comment}
          onChange={(event) => dispatch({ type: "set", field: "comment", value: event.target.value })}
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
