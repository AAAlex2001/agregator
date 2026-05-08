import { Button, CalendarInput, TextInput } from "@/source/shared/ui";
import type { OrderCardData } from "@/source/entities/order";
import { BidFilesField } from "@/source/features/expert-orders/ui/OrderModal/BidFilesField";
import { OrderSummaryPanel } from "@/source/features/expert-orders/ui/OrderModal/OrderSummaryPanel";
import { VAT_LABEL } from "@/source/entities/response";
import type { VatKind } from "@/source/entities/response";
import s from "./EditResponseModal.module.scss";

const VAT_OPTIONS: VatKind[] = ["NONE", "VAT_5", "VAT_7", "VAT_22"];

interface EditResponseModalProps {
  dateText: string;
  status: string;
  statusColor: string;
  statusBg: string;
  order: OrderCardData;
  deadline: string;
  cost: string;
  comment: string;
  vatKind: VatKind;
  files: File[];
  existingFiles: Array<{ key: string; url: string }>;
  canSubmit: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onDeadlineChange: (value: string) => void;
  onCostChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onVatKindChange: (value: VatKind) => void;
  onAddFiles: (files: FileList | null) => void;
  onRemoveFile: (index: number) => void;
  onRemoveExistingFile: (index: number) => void;
}

export function EditResponseModal({
  dateText,
  status,
  statusColor,
  statusBg,
  order,
  deadline,
  cost,
  comment,
  vatKind,
  files,
  existingFiles,
  canSubmit,
  isSubmitting,
  onClose,
  onSubmit,
  onDeadlineChange,
  onCostChange,
  onCommentChange,
  onVatKindChange,
  onAddFiles,
  onRemoveFile,
  onRemoveExistingFile,
}: EditResponseModalProps) {
  return (
    <div className={s.overlay} onClick={onClose} role="presentation">
      <div
        className={s.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className={s.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <div className={s.headerRow}>
          <span className={s.headerTitle}>Изменение предложения</span>
          <div className={s.statusRow}>
            <span className={s.dateText}>{dateText}</span>
            <span className={s.statusBadge} style={{ color: statusColor, background: statusBg }}>
              {status}
            </span>
          </div>
        </div>

        <OrderSummaryPanel order={order} />

        <div className={s.formRow}>
          <div className={s.fieldGroup}>
            <span className={s.fieldLabel}>Укажите ваши сроки</span>
            <CalendarInput active value={deadline} onChange={onDeadlineChange} placeholder="Выберите дату" />
          </div>

          <div className={s.fieldGroup}>
            <span className={s.fieldLabel}>Ваша оценка стоимости работ</span>
            <TextInput
              active
              inputMode="numeric"
              value={cost}
              onChange={(event) => onCostChange(event.target.value)}
              placeholder="Сумма в рублях"
            />
          </div>
        </div>

        <div className={s.fieldGroup}>
          <span className={s.fieldLabel}>НДС</span>
          <div className={s.vatGroup} role="radiogroup" aria-label="НДС">
            {VAT_OPTIONS.map((kind) => {
              const active = vatKind === kind;
              return (
                <button
                  key={kind}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={`${s.vatChip} ${active ? s.vatChipActive : ""}`.trim()}
                  onClick={() => onVatKindChange(kind)}
                >
                  {VAT_LABEL[kind]}
                </button>
              );
            })}
          </div>
        </div>

        <span className={s.formHint}>
          Указанная вами сумма является ориентировочной. Точная стоимость будет согласована с заказчиком после изучения технического задания.
        </span>

        <div className={s.textareaGroup}>
          <span className={s.fieldLabel}>Комментарий для заказчика</span>
          <textarea
            className={s.textarea}
            value={comment}
            onChange={(event) => onCommentChange(event.target.value)}
            placeholder="Напишите комментарий для заказчика..."
            maxLength={5000}
          />
        </div>

        <BidFilesField
          files={files}
          existingFiles={existingFiles}
          onAddFiles={onAddFiles}
          onRemoveFile={onRemoveFile}
          onRemoveExistingFile={onRemoveExistingFile}
        />

        <div className={s.actionRow}>
          <Button variant="outline" size="sm" fullWidth onClick={onClose}>
            Отменить
          </Button>
          <Button variant="primary" size="sm" fullWidth disabled={!canSubmit} isLoading={isSubmitting} onClick={onSubmit}>
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
}