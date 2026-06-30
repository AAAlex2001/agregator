import { useState } from "react";
import { BottomSheet, Button, TextField } from "@/shared/ui";
import { CalendarPicker } from "@/shared/ui/calendar-picker";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic, tapHaptic } from "@/shared/services/telegram";
import { CheckIcon } from "@/shared/ui/icons/interface";
import type { Order } from "@/entites/order";
import { createOrderResponse, type VatKind } from "../model/api";
import s from "./respond-sheet.module.scss";

interface Props {
  order: Order | null;
  onClose: () => void;
}

const VAT_OPTIONS: { code: VatKind; label: string }[] = [
  { code: "NONE", label: "Без НДС" },
  { code: "VAT_5", label: "С НДС 5%" },
  { code: "VAT_7", label: "С НДС 7%" },
  { code: "VAT_22", label: "С НДС 22%" },
];

const VAT_RATE: Record<VatKind, number> = { NONE: 0, VAT_5: 5, VAT_7: 7, VAT_22: 22 };

const TITLES = ["Отклик на заявку", "Подтверждение", "Ваше предложение"];

function toKopecks(value: string): number {
  const n = Number(value.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : 0;
}

function formatRub(kopecks: number): string {
  const rub = Math.round(kopecks / 100);
  return `${String(rub).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}

function formatDateRu(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

function formatDeadline(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [sum, setSum] = useState("");
  const [vat, setVat] = useState<VatKind>("NONE");
  const [comment, setComment] = useState("");
  const [calField, setCalField] = useState<"start" | "end" | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const close = () => {
    setStep(0);
    setStartDate("");
    setDeadline("");
    setSum("");
    setVat("NONE");
    setComment("");
    setCalField(null);
    setBusy(false);
    setDone(false);
    onClose();
  };

  const submit = async () => {
    if (!order) return;
    if (startDate && deadline && startDate > deadline) {
      emitError("Срок начала не может быть позже срока окончания");
      return;
    }
    setBusy(true);
    try {
      await createOrderResponse(order.id, {
        proposed_sum_amount: toKopecks(sum),
        proposed_start_date: startDate,
        proposed_deadline: deadline,
        vat_kind: vat,
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

  const base = toKopecks(sum);
  const canSubmit = base > 0 && startDate !== "" && deadline !== "";
  const total = base > 0 ? Math.round(base * (1 + VAT_RATE[vat] / 100)) : 0;

  return (
    <BottomSheet open={order !== null} title={done ? "" : TITLES[step]} onClose={close}>
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
            <span className={step === 2 ? s.dotActive : s.dot} />
          </div>

          {step === 0 && (
            <div className={s.info}>
              <p className={s.orderTitle}>{order.title}</p>
              {order.company && <p className={s.company}>{order.company}</p>}
              <div className={s.rows}>
                <Row label="Начальная цена" value={order.sum} />
                <Row label="Срок выполнения" value={order.date} />
                {order.responses_deadline && (
                  <Row label="Приём откликов до" value={formatDeadline(order.responses_deadline)} />
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
          )}

          {step === 1 && (
            <div className={s.confirm}>
              <p className={s.confirmLead}>Что будет дальше</p>
              <ul className={s.confirmList}>
                <li>Отклик спишется с вашего тарифа.</li>
                <li>Заказчик увидит ваше предложение: цену, сроки и комментарий.</li>
                <li>Если заказчик выберет вас — он свяжется для заключения договора.</li>
              </ul>
            </div>
          )}

          {step === 2 && (
            <div className={s.form}>
              <div className={s.field}>
                <span className={s.fieldLabel}>Срок начала выполнения работ</span>
                <button
                  type="button"
                  className={`${s.dateBtn} ${startDate ? "" : s.dateEmpty}`}
                  onClick={() => setCalField("start")}
                >
                  {startDate ? formatDateRu(startDate) : "Выберите дату"}
                </button>
              </div>
              <div className={s.field}>
                <span className={s.fieldLabel}>Срок окончания выполнения работ</span>
                <button
                  type="button"
                  className={`${s.dateBtn} ${deadline ? "" : s.dateEmpty}`}
                  onClick={() => setCalField("end")}
                >
                  {deadline ? formatDateRu(deadline) : "Выберите дату"}
                </button>
              </div>
              <TextField
                label="Ваша оценка стоимости работ"
                inputMode="numeric"
                placeholder="Сумма в рублях"
                value={sum}
                onChange={(e) => setSum(e.target.value)}
              />
              <div className={s.field}>
                <span className={s.fieldLabel}>НДС</span>
                <div className={s.vatGroup}>
                  {VAT_OPTIONS.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      className={`${s.vatOption} ${vat === option.code ? s.vatActive : ""}`}
                      onClick={() => {
                        tapHaptic();
                        setVat(option.code);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {total > 0 && vat !== "NONE" && (
                  <span className={s.vatTotal}>Итого с НДС: {formatRub(total)}</span>
                )}
              </div>
              <div className={s.field}>
                <span className={s.fieldLabel}>Комментарий для заказчика</span>
                <textarea
                  className={s.textarea}
                  rows={3}
                  placeholder="Напишите комментарий для заказчика…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className={s.footer}>
            {step === 0 && <Button onClick={() => setStep(1)}>Откликнуться</Button>}
            {step === 1 && (
              <>
                <Button variant="outline" onClick={close}>
                  Отмена
                </Button>
                <Button onClick={() => setStep(2)}>Продолжить</Button>
              </>
            )}
            {step === 2 && (
              <>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Назад
                </Button>
                <Button onClick={() => void submit()} loading={busy} disabled={!canSubmit}>
                  Подать заявку
                </Button>
              </>
            )}
          </div>

          <CalendarPicker
            open={calField !== null}
            value={calField === "start" ? startDate : deadline}
            onClose={() => setCalField(null)}
            onApply={(date) => (calField === "start" ? setStartDate(date) : setDeadline(date))}
          />
        </div>
      )}
    </BottomSheet>
  );
}
