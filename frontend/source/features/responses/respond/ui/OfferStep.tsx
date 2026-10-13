import type { Dispatch, FormEvent } from "react";
import { OrderSummaryPanel, type OrderCardData } from "@/source/entities/order";
import { PartySuggestInput } from "@/source/entities/party";
import { BidFilesField, VatKindField, type BidFiles } from "@/source/entities/response";
import Button from "@/source/shared/ui/Button";
import { CalendarInput } from "@/source/shared/ui/CalendarInput";
import { TextInput } from "@/source/shared/ui/Inputs";
import type { OfferAction, OfferState } from "../model/types";
import { StepHeader } from "./StepHeader";
import s from "./OfferStep.module.scss";

interface OfferStepProps {
  order: OrderCardData;
  offer: OfferState;
  dispatch: Dispatch<OfferAction>;
  bid: BidFiles;
  isSending: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

/** Шаг 2: сроки, цена с НДС, компания, комментарий и файлы предложения. */
export function OfferStep({ order, offer, dispatch, bid, isSending, onBack, onSubmit }: OfferStepProps) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={submit} className={s.step}>
      <StepHeader step="Шаг 2. Дополнение заявки" />
      <OrderSummaryPanel order={order} />

      <div className={s.formRow}>
        <div className={s.field}>
          <span className={s.label}>Срок начала выполнения работ</span>
          <CalendarInput
            active
            value={offer.startDate}
            onChange={(value) => dispatch({ type: "field", field: "startDate", value })}
            placeholder="Выберите дату"
          />
        </div>
        <div className={s.field}>
          <span className={s.label}>Срок окончания выполнения работ</span>
          <CalendarInput
            active
            value={offer.deadline}
            onChange={(value) => dispatch({ type: "field", field: "deadline", value })}
            placeholder="Выберите дату"
          />
        </div>
      </div>

      <div className={s.field}>
        <span className={s.label}>Ваша оценка стоимости работ</span>
        <TextInput
          active
          required
          inputMode="numeric"
          value={offer.cost}
          onChange={(event) => dispatch({ type: "cost", value: event.target.value })}
          placeholder="Сумма в рублях"
        />
      </div>

      <div className={s.field}>
        <span className={s.label}>НДС</span>
        <VatKindField
          value={offer.vatKind}
          baseAmount={Number(offer.cost) || 0}
          onChange={(value) => dispatch({ type: "vatKind", value })}
        />
      </div>

      <span className={s.formHint}>
        Указанная вами сумма является ориентировочной. Точная стоимость будет согласована с заказчиком после изучения технического задания.
      </span>

      {order.requiresLicense && (
        <div className={s.field}>
          <span className={s.label}>Организация, от которой подаёте заявку для последующего заключения договора:</span>
          <PartySuggestInput
            value={offer.companyName}
            onChange={(query, picked) => dispatch({ type: "company", name: picked?.value ?? query, company: picked })}
            placeholder="ИНН или название компании"
          />
        </div>
      )}

      <div className={s.field}>
        <span className={s.label}>Комментарий для заказчика</span>
        <textarea
          className={s.textarea}
          value={offer.comment}
          onChange={(event) => dispatch({ type: "field", field: "comment", value: event.target.value })}
          placeholder="Напишите комментарий для заказчика..."
          maxLength={5000}
        />
      </div>

      <BidFilesField items={bid.items} onAdd={bid.add} />

      <div className={s.actionRow}>
        <Button variant="outline" size="sm" fullWidth onClick={onBack}>
          Назад
        </Button>
        <Button type="submit" variant="primary" size="sm" fullWidth isLoading={isSending}>
          Подать заявку
        </Button>
      </div>
    </form>
  );
}
