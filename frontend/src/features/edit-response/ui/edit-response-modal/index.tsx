"use client";

import type { ChangeEvent } from "react";
import { OrderSummaryPanel } from "@/entities/order";
import { getResponseStatusBadge, ResponseFilesField, VatKindField } from "@/entities/response";
import type { ResponseItem } from "@/entities/response";
import { Button } from "@/shared/ui/button";
import { CalendarInput } from "@/shared/ui/calendar-input";
import { Modal } from "@/shared/ui/modal";
import { TextInput } from "@/shared/ui/text-input";
import { useEditResponse } from "../../model/use-edit-response";
import styles from "./style.module.scss";

/** Изменяемый отклик и действия после сохранения или закрытия окна. */
interface EditResponseModalProps {
  response: ResponseItem;
  onClose: () => void;
  onSaved: () => void;
}

/** Форма новых сроков, стоимости, комментария и файлов предложения. */
export function EditResponseModal({ response, onClose, onSaved }: EditResponseModalProps) {
  const form = useEditResponse(response, onSaved);
  const status = getResponseStatusBadge(response, "EXPERT");

  /** Сохраняет выбранный срок начала работ. */
  function changeStartDate(value: string) {
    form.changeField("startDate", value);
  }

  /** Сохраняет выбранный срок окончания работ. */
  function changeDeadline(value: string) {
    form.changeField("deadline", value);
  }

  /** Передаёт введённую стоимость для очистки от посторонних символов. */
  function changeCost(event: ChangeEvent<HTMLInputElement>) {
    form.changeCost(event.target.value);
  }

  /** Сохраняет пояснение исполнителя к предложению. */
  function changeComment(event: ChangeEvent<HTMLTextAreaElement>) {
    form.changeField("comment", event.target.value);
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      isBusy={form.state.isSubmitting}
      dialogClassName={styles.dialog}
    >
      <div className={styles.headerRow}>
        <span className={styles.headerTitle}>Изменение предложения</span>
        <div className={styles.statusRow}>
          <span className={styles.dateText}>Отклик от {response.date}</span>
          <span
            className={styles.statusBadge}
            style={{
              color: status.color,
              background: status.background,
            }}
          >
            {status.text}
          </span>
        </div>
      </div>

      <OrderSummaryPanel
        order={{
          title: response.order_title,
          company: response.customer_company,
          customer_name: response.customer_name,
          customer_inn: response.customer_inn,
          start_date: response.order_start_date,
          date: response.order_date,
          sum: response.order_sum || response.proposed_sum,
          badges: response.badges,
        }}
      />

      <div className={styles.formRow}>
        <div className={styles.field}>
          <span className={styles.label}>Срок начала выполнения работ</span>
          <CalendarInput
            active
            value={form.state.startDate}
            onChange={changeStartDate}
            placeholder="Выберите дату"
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Срок окончания выполнения работ</span>
          <CalendarInput
            active
            value={form.state.deadline}
            onChange={changeDeadline}
            placeholder="Выберите дату"
          />
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Ваша оценка стоимости работ</span>
        <TextInput
          active
          inputMode="numeric"
          value={form.state.cost}
          onChange={changeCost}
          placeholder="Сумма в рублях"
        />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>НДС</span>
        <VatKindField
          value={form.state.vatKind}
          baseAmount={Number(form.state.cost) || 0}
          onChange={form.changeVatKind}
        />
      </div>

      <span className={styles.formHint}>
        Указанная вами сумма является ориентировочной. Точная стоимость будет
        согласована с заказчиком после изучения технического задания.
      </span>

      <div className={styles.field}>
        <span className={styles.label}>Комментарий для заказчика</span>
        <textarea
          className={styles.textarea}
          value={form.state.comment}
          onChange={changeComment}
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
          onClick={onClose}
        >
          Отменить
        </Button>
        <Button
          variant="primary"
          size="sm"
          fullWidth
          disabled={!form.canSubmit}
          isLoading={form.state.isSubmitting}
          onClick={form.submit}
        >
          Сохранить
        </Button>
      </div>
    </Modal>
  );
}
