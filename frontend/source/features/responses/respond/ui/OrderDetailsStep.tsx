import type { ReactNode } from "react";
import { DocumentsGallery, isResponsesClosed, OrderBrief, type OrderCardData } from "@/source/entities/order";
import Button from "@/source/shared/ui/Button";
import s from "./OrderDetailsStep.module.scss";

interface OrderDetailsStepProps {
  order: OrderCardData;
  questions: ReactNode;
  onRespond: () => void;
}

/** Первый экран: условия заказа, документы, вопросы и кнопка «Откликнуться». */
export function OrderDetailsStep({ order, questions, onRespond }: OrderDetailsStepProps) {
  const isExpired = isResponsesClosed(order);

  return (
    <div className={s.step}>
      <OrderBrief order={order} />
      <DocumentsGallery documents={order.documents} />
      {questions}
      <div className={s.actions}>
        {isExpired && <span className={s.expiredHint}>На заказ больше нельзя откликнуться</span>}
        <Button variant="primary" size="md" fullWidth showArrow disabled={isExpired} onClick={onRespond}>
          Откликнуться
        </Button>
      </div>
    </div>
  );
}
