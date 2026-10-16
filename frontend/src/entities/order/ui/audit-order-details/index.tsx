import type { AuditOrderDetails as AuditDetails } from "../../model/details/audit";
import { OrderDetailSections } from "../order-detail-sections";
import { applicantDetails } from "../../model/applicant-details";
import {
  AUDIT_KIND_LABELS,
  AUDIT_SCALE_LABELS,
  AUDIT_TIMELINE_LABELS,
} from "../../config/audit-labels";

/** Объекты и параметры аудита в заказе. */
interface AuditOrderDetailsProps {
  details: AuditDetails;
}

/** Показывает объекты аудита, выбранные проверки, документы и сроки. */
export function AuditOrderDetails({ details }: AuditOrderDetailsProps) {
  const objects = details.opo_items
    .map((item) => [item.registration_number, item.name].filter(Boolean).join(" — "))
    .filter(Boolean)
    .join("\n");

  return (
    <OrderDetailSections
      sections={[
        applicantDetails(details),
        {
          title: "Объект аудита",
          rows: [
            {
              label: "Что нужно аудировать",
              value: AUDIT_SCALE_LABELS[details.audit_scale],
            },
            {
              label: "Общее количество ОПО",
              value: details.opo_total,
            },
            {
              label: "ОПО I класса",
              value: details.opo_class_1,
            },
            {
              label: "ОПО II класса",
              value: details.opo_class_2,
            },
            {
              label: "ОПО III класса",
              value: details.opo_class_3,
            },
            {
              label: "ОПО IV класса",
              value: details.opo_class_4,
            },
            {
              label: "Основной отраслевой профиль",
              value: details.main_industry,
            },
            {
              label: "ОПО в разных субъектах РФ",
              value: details.multiple_regions,
            },
            {
              label: "Объекты",
              value: objects,
              wide: true,
            },
            {
              label: "Свидетельство о регистрации ОПО",
              value: details.registration_certificate?.name,
            },
          ],
        },
        {
          title: "Параметры аудита",
          rows: [
            {
              label: "Тип аудита",
              value: AUDIT_KIND_LABELS[details.audit_kind],
            },
            {
              label: "Учитывать СТО организации",
              value: details.considers_sto,
            },
            {
              label: "СТО",
              value: details.sto_name,
            },
            {
              label: "Файл СТО",
              value: details.sto_file?.name,
            },
            {
              label: "Направления аудита (п.17 Приказа 318)",
              value: details.audit_areas.join(", "),
              wide: true,
            },
          ],
        },
        {
          title: "Сроки и комментарии",
          rows: [
            {
              label: "Желаемые сроки",
              value: AUDIT_TIMELINE_LABELS[details.desired_timeline],
            },
            {
              label: "Комментарии",
              value: details.comments,
              wide: true,
            },
          ],
        },
      ]}
    />
  );
}
