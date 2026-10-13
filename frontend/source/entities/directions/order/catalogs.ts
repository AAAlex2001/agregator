import { emptyAuditCatalogs, type AuditCatalogs } from "../audit";
import { emptyDesignCatalogs, type DesignCatalogs } from "../design";
import { emptyEcologyCatalogs, type EcologyCatalogs } from "../ecology";
import { emptySurveyCatalogs, type SurveyCatalogs } from "../survey";

export interface OrderCatalogs {
  audit: AuditCatalogs;
  design: DesignCatalogs;
  ecology: EcologyCatalogs;
  survey: SurveyCatalogs;
}

export const emptyOrderCatalogs: OrderCatalogs = {
  audit: emptyAuditCatalogs,
  design: emptyDesignCatalogs,
  ecology: emptyEcologyCatalogs,
  survey: emptySurveyCatalogs,
};
