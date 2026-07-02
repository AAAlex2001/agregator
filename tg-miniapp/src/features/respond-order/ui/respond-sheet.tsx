import { useEffect, useRef, useState } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic, tapHaptic } from "@/shared/services/telegram";
import { CalendarPicker } from "@/shared/ui/calendar-picker";
import type { Order } from "@/entites/order";
import { createOrderResponse, type Party, type VatKind } from "../model/api";
import { toKopecks } from "../model/format";
import { StepHero } from "./step-hero";
import { InfoStep } from "./steps/info-step";
import { DocumentsStep } from "./steps/documents-step";
import { QuestionsStep } from "./steps/questions-step";
import { ConfirmStep } from "./steps/confirm-step";
import { OfferStep } from "./steps/offer-step";
import s from "./respond-sheet.module.scss";

const TOTAL = 5;
type StepMeta = { image: string; illu: string; label: string; title: string; desc: string };

const META: Record<number, StepMeta> = {
  1: { image: "step-1", illu: "📋", label: "Шаг 1 из 5", title: "Информация по заказу", desc: "Изучите условия перед откликом" },
  2: { image: "step-2", illu: "📎", label: "Шаг 2 из 5", title: "Документы заказчика", desc: "ТЗ, договор и другие вложения" },
  3: { image: "step-3", illu: "💬", label: "Шаг 3 из 5", title: "Вопросы по заказу", desc: "Уточните детали у заказчика" },
  4: { image: "step-4", illu: "🤝", label: "Шаг 4 из 5", title: "Подтверждение", desc: "Что произойдёт после отклика" },
  5: { image: "step-5", illu: "✍️", label: "Шаг 5 из 5", title: "Ваше предложение", desc: "Сроки, цена и комментарий" },
};
const SUCCESS_META: StepMeta = { image: "success", illu: "🎉", label: "Готово", title: "Отклик отправлен", desc: "Ждите ответа в боте" };

interface Props {
  order: Order | null;
  onClose: () => void;
}

export function RespondSheet({ order, onClose }: Props) {
  const open = order !== null;
  const [rendered, setRendered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [frozen, setFrozen] = useState<Order | null>(null);

  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [sum, setSum] = useState("");
  const [vat, setVat] = useState<VatKind>("NONE");
  const [comment, setComment] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [party, setParty] = useState<Party | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [calField, setCalField] = useState<"start" | "end" | null>(null);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    setStep(1);
    setDone(false);
    setStartDate("");
    setDeadline("");
    setSum("");
    setVat("NONE");
    setComment("");
    setCompanyName("");
    setParty(null);
    setFiles([]);
    setCalField(null);
    setBusy(false);
  };

  useEffect(() => {
    if (open) {
      setFrozen(order);
      setRendered(true);
      setClosing(false);
      return;
    }
    if (!rendered) return;
    setClosing(true);
    const timer = window.setTimeout(() => {
      setRendered(false);
      setClosing(false);
      reset();
    }, 320);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (order) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id]);

  useEffect(() => {
    if (!rendered) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [rendered]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, done]);

  const data = order ?? frozen;
  if (!rendered || !data) return null;

  const close = () => {
    tapHaptic();
    onClose();
  };

  const needsCompany = data.requires_license;
  const companyOk = !needsCompany || Boolean(party && party.data.inn);
  const canSubmit = toKopecks(sum) > 0 && startDate !== "" && deadline !== "" && companyOk;

  const submit = async () => {
    if (!canSubmit || busy) return;
    if (startDate > deadline) {
      emitError("Срок начала не может быть позже срока окончания");
      return;
    }
    setBusy(true);
    try {
      await createOrderResponse(data.id, {
        proposed_sum_amount: toKopecks(sum),
        proposed_start_date: startDate,
        proposed_deadline: deadline,
        vat_kind: vat,
        comment: comment.trim(),
        expert_inn: needsCompany ? party?.data.inn ?? undefined : undefined,
        expert_company_data: needsCompany && party ? JSON.stringify(party) : undefined,
        files,
      });
      notifyHaptic("success");
      setDone(true);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось откликнуться");
    } finally {
      setBusy(false);
    }
  };

  const meta = done ? SUCCESS_META : META[step];

  return (
    <div className={`${s.overlay} ${closing ? s.closing : ""}`} onClick={close}>
      <div className={`${s.sheet} ${closing ? s.closing : ""}`} onClick={(e) => e.stopPropagation()}>
        <StepHero
          image={meta.image}
          illu={meta.illu}
          step={step}
          total={TOTAL}
          label={meta.label}
          title={meta.title}
          desc={meta.desc}
          showDots={!done}
          onClose={close}
        />

        <div className={s.scroll} ref={scrollRef}>
          <div className={s.panel}>
            {done ? (
              <div className={s.success}>
                <p className={s.successTitle}>Отклик отправлен!</p>
                <p className={s.successSub}>
                  Заказчик увидит ваше предложение по заявке «{data.title}». Ответ придёт в бота 🔔
                </p>
              </div>
            ) : step === 1 ? (
              <InfoStep order={data} />
            ) : step === 2 ? (
              <DocumentsStep order={data} />
            ) : step === 3 ? (
              <QuestionsStep orderId={data.id} />
            ) : step === 4 ? (
              <ConfirmStep />
            ) : (
              <OfferStep
                requiresLicense={needsCompany}
                startDate={startDate}
                deadline={deadline}
                sum={sum}
                vat={vat}
                comment={comment}
                companyName={companyName}
                files={files}
                onOpenDate={setCalField}
                onChangeSum={setSum}
                onChangeVat={setVat}
                onChangeComment={setComment}
                onCompanyText={(t) => {
                  setCompanyName(t);
                  setParty(null);
                }}
                onCompanyPick={(picked) => {
                  setCompanyName(picked.value);
                  setParty(picked);
                }}
                onAddFiles={(list) => list && setFiles((prev) => [...prev, ...Array.from(list)])}
                onRemoveFile={(i) => setFiles((prev) => prev.filter((_, j) => j !== i))}
              />
            )}
          </div>
        </div>

        <div className={s.footer}>
          {done ? (
            <button className={`${s.btn} ${s.btnPrimary}`} onClick={close}>Готово</button>
          ) : step === 1 ? (
            <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setStep(2)}>Далее →</button>
          ) : step === 5 ? (
            <>
              <button className={`${s.btn} ${s.btnOutline}`} onClick={() => setStep(4)}>Назад</button>
              <button
                className={`${s.btn} ${s.btnPrimary}`}
                disabled={!canSubmit || busy}
                onClick={() => void submit()}
              >
                Откликнуться →
              </button>
            </>
          ) : (
            <>
              <button className={`${s.btn} ${s.btnOutline}`} onClick={() => setStep(step - 1)}>Назад</button>
              <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setStep(step + 1)}>
                {step === 4 ? "Продолжить" : "Далее →"}
              </button>
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
    </div>
  );
}
