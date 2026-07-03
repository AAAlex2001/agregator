import { useEffect, useState } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic, tapHaptic } from "@/shared/services/telegram";
import { Button, FullSheet, SheetHero } from "@/shared/ui";
import { CalendarPicker } from "@/shared/ui/calendar-picker";
import type { Order } from "@/entites/order";
import type { VatKind } from "@/entites/response";
import { createOrderResponse, type Party } from "../model/api";
import { toKopecks } from "@/shared/lib/format";
import { InfoStep } from "./steps/info-step";
import { DocumentsStep } from "./steps/documents-step";
import { QuestionsStep } from "./steps/questions-step";
import { ConfirmStep } from "./steps/confirm-step";
import { OfferStep } from "./steps/offer-step";
import s from "./respond-sheet.module.scss";

const TOTAL = 5;
type StepMeta = { image: string; label: string; title: string; desc: string };

const META: Record<number, StepMeta> = {
  1: { image: "step-1", label: "Шаг 1 из 5", title: "Информация по заказу", desc: "Изучите условия перед откликом" },
  2: { image: "step-2", label: "Шаг 2 из 5", title: "Документы заказчика", desc: "ТЗ, договор и другие вложения" },
  3: { image: "step-3", label: "Шаг 3 из 5", title: "Вопросы по заказу", desc: "Уточните детали у заказчика" },
  4: { image: "step-4", label: "Шаг 4 из 5", title: "Подтверждение", desc: "Что произойдёт после отклика" },
  5: { image: "step-5", label: "Шаг 5 из 5", title: "Ваше предложение", desc: "Сроки, цена и комментарий" },
};
const SUCCESS_META: StepMeta = { image: "success", label: "Готово", title: "Отклик отправлен", desc: "Ждите ответа в боте" };

interface Props {
  order: Order | null;
  onClose: () => void;
}

export function RespondSheet({ order, onClose }: Props) {
  const open = order !== null;
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

  useEffect(() => {
    if (!open) return;
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
    for (const meta of Object.values(META)) {
      for (const theme of ["light", "dark"]) {
        const img = new Image();
        img.src = `/respond-order/${meta.image}-${theme}.webp`;
      }
    }
  }, [open]);

  const close = () => {
    tapHaptic();
    onClose();
  };

  const needsCompany = order?.requires_license ?? false;
  const companyOk = !needsCompany || Boolean(party && party.data.inn);
  const canSubmit = toKopecks(sum) > 0 && startDate !== "" && deadline !== "" && companyOk;

  const submit = async () => {
    if (!order || !canSubmit || busy) return;
    if (startDate > deadline) {
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
  const pinnedActions = step === 1 && !done;

  const actionsContent = done ? (
    <Button onClick={close}>Готово</Button>
  ) : step === 1 ? (
    <Button onClick={() => setStep(2)}>Далее</Button>
  ) : step === 5 ? (
    <>
      <Button variant="outline" onClick={() => setStep(4)}>Назад</Button>
      <Button disabled={!canSubmit} loading={busy} onClick={() => void submit()}>
        Откликнуться
      </Button>
    </>
  ) : (
    <>
      <Button variant="outline" onClick={() => setStep(step - 1)}>Назад</Button>
      <Button onClick={() => setStep(step + 1)}>{step === 4 ? "Продолжить" : "Далее"}</Button>
    </>
  );

  return (
    <FullSheet
      open={open}
      onClose={close}
      scrollKey={done ? "done" : step}
      hero={
        <SheetHero
          key={meta.image}
          light={`/respond-order/${meta.image}-light.webp`}
          dark={`/respond-order/${meta.image}-dark.webp`}
          label={meta.label}
          title={meta.title}
          desc={meta.desc}
          step={done ? undefined : step}
          total={done ? undefined : TOTAL}
          onClose={close}
        />
      }
      footer={pinnedActions ? actionsContent : null}
    >
      {order && (
        <div key={done ? "done" : step} className={s.stepAnim}>
          {done ? (
            <div className={s.success}>
              <p className={s.successTitle}>Отклик отправлен!</p>
              <p className={s.successSub}>
                Заказчик увидит ваше предложение по заявке «{order.title}». Ответ придёт в бота
              </p>
            </div>
          ) : step === 1 ? (
            <InfoStep order={order} />
          ) : step === 2 ? (
            <DocumentsStep order={order} />
          ) : step === 3 ? (
            <QuestionsStep orderId={order.id} />
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
              onAddFiles={(list) => {
                const picked = list ? Array.from(list) : [];
                if (picked.length) setFiles((prev) => [...prev, ...picked]);
              }}
              onRemoveFile={(i) => setFiles((prev) => prev.filter((_, j) => j !== i))}
            />
          )}

          {!pinnedActions && <div className={s.actions}>{actionsContent}</div>}

          <CalendarPicker
            open={calField !== null}
            value={calField === "start" ? startDate : deadline}
            onClose={() => setCalField(null)}
            onApply={(date) => (calField === "start" ? setStartDate(date) : setDeadline(date))}
          />
        </div>
      )}
    </FullSheet>
  );
}
