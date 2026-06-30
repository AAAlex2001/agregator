import { useState } from "react";
import { BottomSheet, Button, TextField } from "@/shared/ui";
import { CalendarPicker } from "@/shared/ui/calendar-picker";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { CheckIcon } from "@/shared/ui/icons/interface";
import type { Order } from "@/entites/order";
import { createOrderResponse } from "../model/api";
import s from "./respond-sheet.module.scss";

interface Props {
  order: Order | null;
  onClose: () => void;
}

function toKopecks(value: string): number {
  const n = Number(value.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : 0;
}

function formatDateRu(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={s.row}>
      <span className={s.rowLabel}>{label}</span>
      <span className={s.rowValue}>{value}</span>
    </div>
  );
}

export function RespondSheet({ order, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [sum, setSum] = useState("");
  const [deadline, setDeadline] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [calOpen, setCalOpen] = useState(false);

  const close = () => {
    setStep(0);
    setSum("");
    setDeadline("");
    setComment("");
    setDone(false);
    setCalOpen(false);
    onClose();
  };

  const submit = async () => {
    if (!order) return;
    setBusy(true);
    try {
      await createOrderResponse(order.id, {
        proposed_sum_amount: toKopecks(sum),
        proposed_deadline: deadline,
        comment: comment.trim(),
      });
      notifyHaptic("success");
      setDone(true);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось откликнуться");
    } finally {
      setBusy(false);
    }
  };

  const canSubmit = toKopecks(sum) > 0 && deadline !== "";

  return (
    <BottomSheet open={order !== null} title={done ? "" : "Отклик на заявку"} onClose={close}>
      {order === null ? null : done ? (
        <div className={s.success}>
          <span className={s.check}>
            <CheckIcon width={34} height={34} />
          </span>
          <p className={s.successTitle}>Отклик отправлен!</p>
          <p className={s.successSub}>Заказчик увидит ваше предложение по заявке «{order.title}».</p>
          <Button onClick={close}>Готово</Button>
        </div>
      ) : (
        <div className={s.flow}>
          <div className={s.dots}>
            <span className={step === 0 ? s.dotActive : s.dot} />
            <span className={step === 1 ? s.dotActive : s.dot} />
          </div>

          {step === 0 ? (
            <div className={s.info}>
              <p className={s.orderTitle}>{order.title}</p>
              {order.company && <p className={s.company}>{order.company}</p>}
              <div className={s.rows}>
                <Row label="Начальная цена" value={order.sum} />
                <Row label="Срок выполнения" value={order.date} />
                {order.responses_deadline && (
                  <Row label="Приём откликов до" value={order.responses_deadline} />
                )}
              </div>
              {order.badges.length > 0 && (
                <div className={s.badges}>
                  {order.badges.map((badge, index) => (
                    <span key={index} className={s.badge}>
                      {badge.text}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={s.form}>
              <TextField
                label="Ваша цена, ₽"
                inputMode="numeric"
                placeholder="Например, 20000"
                value={sum}
                onChange={(e) => setSum(e.target.value)}
              />
              <div className={s.field}>
                <span className={s.fieldLabel}>Срок выполнения</span>
                <button
                  type="button"
                  className={`${s.dateBtn} ${deadline ? "" : s.dateEmpty}`}
                  onClick={() => setCalOpen(true)}
                >
                  {deadline ? formatDateRu(deadline) : "Выберите дату"}
                </button>
              </div>
              <div className={s.field}>
                <span className={s.fieldLabel}>Комментарий</span>
                <textarea
                  className={s.textarea}
                  rows={3}
                  placeholder="Кратко о вашем предложении"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className={s.footer}>
            {step === 1 && (
              <Button variant="outline" onClick={() => setStep(0)}>
                Назад
              </Button>
            )}
            {step === 0 ? (
              <Button onClick={() => setStep(1)}>Далее</Button>
            ) : (
              <Button onClick={() => void submit()} loading={busy} disabled={!canSubmit}>
                Откликнуться
              </Button>
            )}
          </div>

          <CalendarPicker
            open={calOpen}
            value={deadline}
            onClose={() => setCalOpen(false)}
            onApply={setDeadline}
          />
        </div>
      )}
    </BottomSheet>
  );
}
