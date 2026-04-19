import { Button, CalendarInput, Input } from "@/source/shared/ui";
import type { OrderCardData } from "@/source/entities/order";
import base from "./sectionBase.module.scss";
import { BidFilesField } from "./BidFilesField";
import { ModalHeader } from "./ModalHeader";
import { OrderSummaryPanel } from "./OrderSummaryPanel";
import s from "./OfferStep.module.scss";

interface Props {
  order: OrderCardData;
  deadline: string;
  cost: string;
  comment: string;
  files: File[];
  isSubmitting: boolean;
  onDeadlineChange: (value: string) => void;
  onCostChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onAddFiles: (files: FileList | null) => void;
  onRemoveFile: (index: number) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function OfferStep({
  order,
  deadline,
  cost,
  comment,
  files,
  isSubmitting,
  onDeadlineChange,
  onCostChange,
  onCommentChange,
  onAddFiles,
  onRemoveFile,
  onBack,
  onSubmit,
}: Props) {
  const canSubmit = deadline.trim() !== "" && Number(cost) > 0;
  const commissionText = order.commissionAmountRaw > 0
    ? `Взнос ${order.commissionAmount} будет удержан после выбора вашей кандидатуры.`
    : "Взнос 5% будет рассчитан от вашей предложенной стоимости.";

  return (
    <div className={base.section}>
      <ModalHeader title="Отклик на заказ" step="Шаг 2. Дополнение заявки" />
      <OrderSummaryPanel order={order} />

      <div>
        <span className={s.commissionText}>{commissionText}</span>
      </div>

      <div className={s.formRow}>
        <div className={base.fieldGroup}>
          <span className={base.fieldLabel}>Укажите ваши сроки</span>
          <CalendarInput
            value={deadline}
            onChange={onDeadlineChange}
            placeholder="Выберите дату"
          />
        </div>

        <div className={base.fieldGroup}>
          <span className={base.fieldLabel}>Ваша оценка стоимости работ</span>
          <Input
            type="text"
            variant="text"
            placeholder="Сумма в рублях"
            active
            inputMode="numeric"
            value={cost}
            onChange={(event) => onCostChange(event.target.value)}
            placeholder="Сумма в рублях"
          />
        </div>
      </div>

      <span className={s.formHint}>
        Указанная вами сумма является ориентировочной. Точная стоимость будет согласована с заказчиком после изучения технического задания.
      </span>

      <div className={s.textareaGroup}>
        <span className={base.fieldLabel}>Комментарий для заказчика</span>
        <textarea
          className={s.textarea}
          value={comment}
          onChange={(event) => onCommentChange(event.target.value)}
          placeholder="Напишите комментарий для заказчика..."
          maxLength={5000}
        />
      </div>

      <BidFilesField files={files} onAddFiles={onAddFiles} onRemoveFile={onRemoveFile} />

      <div className={base.actionRow}>
        <Button variant="outline" size="sm" fullWidth onClick={onBack}>
          Назад
        </Button>
        <Button variant="primary" size="sm" fullWidth disabled={!canSubmit} isLoading={isSubmitting} onClick={onSubmit}>
          Подать заявку
        </Button>
      </div>
    </div>
  );
}