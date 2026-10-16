import type { OrderDirection } from "../../model/order-direction";
import { AuditOrderDetails } from "../audit-order-details";
import { CadastralOrderDetails } from "../cadastral-order-details";
import { DesignOrderDetails } from "../design-order-details";
import { EcologyOrderDetails } from "../ecology-order-details";
import { ForensicOrderDetails } from "../forensic-order-details";
import { LaboratoryOrderDetails } from "../laboratory-order-details";
import { ResearchOrderDetails } from "../research-order-details";
import { SurveyOrderDetails } from "../survey-order-details";
import { TechDiagOrderDetails } from "../tech-diag-order-details";

/** Заказ с условиями своего направления. */
interface OrderDirectionDetailsProps {
  order: OrderDirection;
}

/** Выбирает компонент условий по направлению, сохраняя точный тип его полей. */
export function OrderDirectionDetails({ order }: OrderDirectionDetailsProps) {
  if (!order.details) {
    return null;
  }

  switch (order.work_type) {
    case "AUDIT_SUPB":
      return <AuditOrderDetails details={order.details} />;
    case "CADASTRAL":
      return <CadastralOrderDetails details={order.details} />;
    case "DESIGN":
      return <DesignOrderDetails details={order.details} />;
    case "ECOLOGY":
      return <EcologyOrderDetails details={order.details} />;
    case "FORENSIC":
      return <ForensicOrderDetails details={order.details} />;
    case "LABORATORY":
      return <LaboratoryOrderDetails details={order.details} />;
    case "RESEARCH":
      return <ResearchOrderDetails details={order.details} />;
    case "SURVEY":
      return <SurveyOrderDetails details={order.details} />;
    case "TECH_DIAG":
      return <TechDiagOrderDetails details={order.details} />;
  }
}
