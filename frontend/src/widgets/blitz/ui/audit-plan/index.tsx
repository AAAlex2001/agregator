import type { BlitzAuditPlan } from "@/entities/blitz-order";
import { formatDateRu, formatWithTime } from "@/shared/lib/format-date";
import styles from "./style.module.scss";

/** Последняя версия Плана. */
interface AuditPlanProps {
  plan: BlitzAuditPlan;
}

/** Главное из Плана аудита: этапы, совещания, выезд и интервью. */
export function AuditPlan({ plan }: AuditPlanProps) {
  const rows = [
    { label: "Версия", value: String(plan.version) },
    {
      label: "Документарный этап",
      value: `${formatDateRu(plan.documents_start)} — ${formatDateRu(plan.documents_end)}`,
    },
    {
      label: "Выездной этап",
      value: plan.onsite_start
        ? `${formatDateRu(plan.onsite_start)} — ${formatDateRu(plan.onsite_end)}`
        : "",
    },
    {
      label: "Вступительное совещание",
      value: plan.opening_at ? formatWithTime(plan.opening_at) : "",
    },
    {
      label: "Заключительное совещание",
      value: plan.closing_at ? formatWithTime(plan.closing_at) : "",
    },
    { label: "Видеосвязь", value: plan.meeting_link ?? "" },
    { label: "Цеха и участки", value: plan.workshops ?? "" },
    { label: "Интервью", value: plan.interviewees },
  ];

  return (
    <dl className={styles.list}>
      {rows.filter((row) => row.value).map((row) => (
        <div
          key={row.label}
          className={styles.row}
        >
          <dt className={styles.label}>{row.label}</dt>
          <dd className={styles.value}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}