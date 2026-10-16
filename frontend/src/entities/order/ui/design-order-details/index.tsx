import { describeOrderOptions } from "../../model/detail-option";
import type { DesignOrderDetails as DesignDetails } from "../../model/details/design";
import { OrderDetailSections } from "../order-detail-sections";
import { applicantDetails } from "../../model/applicant-details";
import {
  DESIGN_APPROVALS,
  DESIGN_CATEGORIES,
  DESIGN_DOCUMENTATION_KINDS,
  DESIGN_SECTIONS,
} from "../../config/design-details";

/** Объект и состав проектной документации в заказе. */
interface DesignOrderDetailsProps {
  details: DesignDetails;
}

/** Показывает объект проектирования, состав документации и согласования. */
export function DesignOrderDetails({ details }: DesignOrderDetailsProps) {
  const scope = details.scope === "FULL"
    ? "Полный пакет документации"
    : "Отдельные разделы";

  return (
    <OrderDetailSections
      sections={[
        applicantDetails(details),
        {
          title: "Объект",
          rows: [
            {
              label: "Наименование объекта",
              value: details.object_name,
              wide: true,
            },
            {
              label: "Город строительства",
              value: details.construction_city,
            },
          ],
        },
        {
          title: "Документация",
          rows: [
            {
              label: "Направление разрабатываемой документации",
              value: describeOrderOptions(details.doc_categories, DESIGN_CATEGORIES),
              wide: true,
            },
            {
              label: "Вид документации",
              value: describeOrderOptions(details.documentation_kinds, DESIGN_DOCUMENTATION_KINDS),
              wide: true,
            },
            {
              label: "Объём разрабатываемой документации",
              value: scope,
            },
            {
              label: "Разделы проектной документации",
              value: describeOrderOptions(details.sections, DESIGN_SECTIONS),
              wide: true,
            },
          ],
        },
        {
          title: "Согласования",
          rows: [
            {
              label: "Согласования и экспертизы",
              value: describeOrderOptions(details.approvals, DESIGN_APPROVALS),
              wide: true,
            },
            {
              label: "Иные согласования",
              value: details.approvals_other,
              wide: true,
            },
          ],
        },
      ]}
    />
  );
}
