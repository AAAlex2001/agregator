import { Button } from "@/shared/ui";
import type { OrderCardData } from "@/source/entities/order";
import base from "./sectionBase.module.scss";
import { CustomerBrief } from "./CustomerBrief";
import { TechnicalGallery } from "./TechnicalGallery";
import s from "./DetailsStep.module.scss";

interface Props {
  order: OrderCardData;
  onRespond: () => void;
}

export function DetailsStep({ order, onRespond }: Props) {
  const isExpired = order.responsesDeadline ? new Date(order.responsesDeadline) <= new Date() : false;

  return (
    <div className={base.section}>
      <CustomerBrief order={order} />
      <TechnicalGallery files={order.technicalFiles} />

      <div className={s.actions}>
        {isExpired && <span className={s.expiredHint}>На заказ больше нельзя откликнуться</span>}
        <Button variant="primary" size="md" fullWidth showArrow disabled={isExpired} onClick={onRespond}>
          Откликнуться
        </Button>
      </div>
    </div>
  );
}