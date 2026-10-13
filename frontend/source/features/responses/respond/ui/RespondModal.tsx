"use client";

import { useState, type ReactNode } from "react";
import type { OrderCardData } from "@/source/entities/order";
import { Modal } from "@/source/shared/ui/Modal";
import type { RespondStep } from "../model/types";
import { useRespond } from "../model/useRespond";
import { OfferStep } from "./OfferStep";
import { OrderDetailsStep } from "./OrderDetailsStep";
import { TenderStep } from "./TenderStep";
import s from "./RespondModal.module.scss";

interface RespondModalProps {
  order: OrderCardData;
  questions: ReactNode;
  onClose: () => void;
}

/** Отклик на заказ в три шага: условия, подтверждение, предложение. */
export function RespondModal({ order, questions, onClose }: RespondModalProps) {
  const [step, setStep] = useState<RespondStep>("details");
  const { offer, dispatch, bid, isSending, submit } = useRespond(order);

  return (
    <Modal open onClose={onClose} size="lg" isBusy={isSending} dialogClassName={s.dialog}>
      {step === "details" && <OrderDetailsStep order={order} questions={questions} onRespond={() => setStep("tender")} />}
      {step === "tender" && <TenderStep order={order} onBack={() => setStep("details")} onContinue={() => setStep("offer")} />}
      {step === "offer" && (
        <OfferStep
          order={order}
          offer={offer}
          dispatch={dispatch}
          bid={bid}
          isSending={isSending}
          onBack={() => setStep("tender")}
          onSubmit={submit}
        />
      )}
    </Modal>
  );
}
