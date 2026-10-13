import { Button, CalendarInput, Modal, TextInput } from "@/source/shared/ui";
import { OrderSummaryPanel, type OrderSummary } from "@/source/entities/order";
import { BidFilesField, VatKindField } from "@/source/entities/response";
import type { VatKind } from "@/source/entities/response";
import type { FileGalleryItem } from "@/source/shared/ui/FileGallery";
import s from "./EditResponseModal.module.scss";

interface EditResponseModalProps {
  dateText: string;
  status: string;
  statusColor: string;
  statusBg: string;
  order: OrderSummary;
  startDate: string;
  deadline: string;
  cost: string;
  comment: string;
  vatKind: VatKind;
  fileItems: FileGalleryItem[];
  canSubmit: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onStartDateChange: (value: string) => void;
  onDeadlineChange: (value: string) => void;
  onCostChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onVatKindChange: (value: VatKind) => void;
  onAddFiles: (files: FileList | null) => void;
}

export function EditResponseModal({
  dateText,
  status,
  statusColor,
  statusBg,
  order,
  startDate,
  deadline,
  cost,
  comment,
  vatKind,
  fileItems,
  canSubmit,
  isSubmitting,
  onClose,
  onSubmit,
  onStartDateChange,
  onDeadlineChange,
  onCostChange,
  onCommentChange,
  onVatKindChange,
  onAddFiles,
}: EditResponseModalProps) {
  return (
    <Modal open onClose={onClose} size="lg" isBusy={isSubmitting} dialogClassName={s.dialog}>
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
            <span className={s.fieldLabel}>Срок начала выполнения работ</span>
            <CalendarInput active value={startDate} onChange={onStartDateChange} placeholder="Выберите дату" />
          </div>

          <div className={s.fieldGroup}>
            <span className={s.fieldLabel}>Срок окончания выполнения работ</span>
            <CalendarInput active value={deadline} onChange={onDeadlineChange} placeholder="Выберите дату" />
          </div>
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

        <div className={s.fieldGroup}>
          <span className={s.fieldLabel}>НДС</span>
          <VatKindField value={vatKind} baseAmount={Number(cost) || 0} onChange={onVatKindChange} />
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

        <BidFilesField items={fileItems} onAdd={onAddFiles} />

        <div className={s.actionRow}>
          <Button variant="outline" size="sm" fullWidth onClick={onClose}>
            Отменить
          </Button>
          <Button variant="primary" size="sm" fullWidth disabled={!canSubmit} isLoading={isSubmitting} onClick={onSubmit}>
            Сохранить
          </Button>
        </div>
    </Modal>
  );
}
