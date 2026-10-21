import { formatDate, formatDateTime } from "@/shared/lib/date";
import { formatRub } from "@/shared/lib/money";
import Panel from "@/shared/ui/panel";
import {
  AUDIT_KIND_LABELS,
  AUDIT_NEGOTIATION_LABELS,
  AUDIT_STAGE_LABELS,
  AUDIT_TIMING_LABELS,
  type BlitzAuditDetails,
  type BlitzOrder,
} from "../../model/types";
import styles from "./style.module.scss";

type AuditSummaryProps = {
  order: BlitzOrder;
  details: BlitzAuditDetails;
};

/** Период с… по… или пусто. */
const period = (start: string | null, end: string | null) =>
  start && end ? `${formatDate(start)} — ${formatDate(end)}` : null;

/** ОПО одной строкой каждый или сведения обо всех ОПО. */
const objectsLine = (details: BlitzAuditDetails) => {
  if (details.fleet) {
    const regions = details.fleet.multi_region ? ", разные субъекты РФ" : "";

    return `Все ОПО: ${details.fleet.count}, ${details.fleet.profile}${regions}`;
  }

  return details.objects
    .map((item) => `${item.reg_number} ${item.name}, ${item.hazard_class} класс, ${item.address}`)
    .join("\n");
};

/** Анкета аудита, торг, группа и План — всё, что нужно менеджеру для консультации и контроля. */
const AuditSummary = ({ order, details }: AuditSummaryProps) => {
  const plan = order.audit_plan;
  const { applicant } = details;
  const rows = [
    ["Заявитель", `${applicant.full_name}, ${applicant.position}${applicant.by_proxy ? ", по доверенности" : ""}`],
    ["Контакты", `${applicant.phone}, ${applicant.email}`],
    ["Организация", `${applicant.organization}, ИНН ${applicant.inn}`],
    ["ОПО", objectsLine(details)],
    ["Тип аудита", AUDIT_KIND_LABELS[details.params.kind] ?? details.params.kind],
    ["СТО", details.params.sto_name],
    ["Элементы", details.params.elements.join(", ") || null],
    ["Этапы", details.stages.map((stage) => AUDIT_STAGE_LABELS[stage] ?? stage).join(", ")],
    [
      "Сроки",
      period(details.timing.start, details.timing.end) ?? AUDIT_TIMING_LABELS[details.timing.kind],
    ],
    [
      "Бюджет",
      `${order.price === null ? "не установлен" : formatRub(order.price)}, `
        + (AUDIT_NEGOTIATION_LABELS[details.budget.negotiation] ?? details.budget.negotiation),
    ],
    ["Цена аудитора", order.offer_price === null ? null : formatRub(order.offer_price)],
    ["Цена заказчика", order.counter_price === null ? null : formatRub(order.counter_price)],
    ["Группа", order.team.map((member) => `${member.name}${member.lead ? " (руководитель)" : ""}`).join(", ") || null],
    ["План", plan && `версия ${plan.version}, документы ${period(plan.documents_start, plan.documents_end)}`],
    ["Выезд", plan && period(plan.onsite_start, plan.onsite_end)],
    ["Совещание", plan?.opening_at ? formatDateTime(plan.opening_at) : null],
    ["Правки к Плану", order.plan_comment],
  ].filter(([, value]) => value);

  return (
    <Panel title="Аудит СУПБ">
      <dl className={styles.grid}>
        {rows.map(([label, value]) => (
          <div key={label} className={styles.item}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.value}>{value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
};

export default AuditSummary;