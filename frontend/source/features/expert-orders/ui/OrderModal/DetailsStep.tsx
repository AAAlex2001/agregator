import { Button } from "@/shared/ui";
import type { OrderCardData } from "@/source/entities/order";
import { useSession } from "@/source/features/session";
import { OrderQuestionsBlock } from "@/source/features/order-questions";
import base from "./sectionBase.module.scss";
import { CustomerBrief } from "./CustomerBrief";
import { TechnicalGallery } from "./TechnicalGallery";
import s from "./DetailsStep.module.scss";

interface Props {
  order: OrderCardData;
  onRespond: () => void;
}

export function DetailsStep({ order, onRespond }: Props) {
  const { user, role } = useSession();
  const isExpired = order.responsesDeadline ? new Date(order.responsesDeadline) <= new Date() : false;

  return (
    <div className={base.section}>
      <CustomerBrief order={order} />
      <TechnicalGallery files={order.technicalFiles} />

      <OrderQuestionsBlock
        orderId={order.id}
        currentUserId={user?.id ?? null}
        customerId={order.customerId}
        isCustomer={role === "CUSTOMER"}
        isExpert={role === "EXPERT"}
        expertCanAsk={!isExpired}
      />

      <div className={s.actions}>
        {isExpired && <span className={s.expiredHint}>На заказ больше нельзя откликнуться</span>}
        <Button variant="primary" size="md" fullWidth showArrow disabled={isExpired} onClick={onRespond}>
          Откликнуться
        </Button>
      </div>
    </div>
  );
}