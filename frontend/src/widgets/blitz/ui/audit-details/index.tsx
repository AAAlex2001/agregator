"use client";

import { useBlitzAuditCatalog } from "@/entities/blitz-order";
import type { BlitzAuditDetails, BlitzChoice } from "@/entities/blitz-order";
import { formatDateRu } from "@/shared/lib/format-date";
import styles from "./style.module.scss";

/** Анкета аудита. */
interface AuditDetailsProps {
  details: BlitzAuditDetails;
}

/** Подпись варианта из справочника; пока справочник грузится — код. */
function titleOf(choices: BlitzChoice[] | undefined, code: string): string {
  return choices?.find((choice) => choice.code === code)?.title ?? code;
}

/** Анкета аудита: заявитель, объекты, параметры, сроки и бюджет. */
export function AuditDetails({ details }: AuditDetailsProps) {
  const { catalog } = useBlitzAuditCatalog();
  const { applicant, params, timing } = details;
  const period = timing.kind === "custom"
    ? `${formatDateRu(timing.start)} — ${formatDateRu(timing.end)}`
    : titleOf(catalog?.timings, timing.kind);
  const rows = [
    { label: "Заявитель", value: `${applicant.full_name}, ${applicant.position}` },
    { label: "Организация", value: `${applicant.organization}, ИНН ${applicant.inn}` },
    { label: "Контакты", value: `${applicant.phone}, ${applicant.email}` },
    { label: "Масштаб", value: titleOf(catalog?.scopes, details.scope) },
    { label: "Тип аудита", value: titleOf(catalog?.kinds, params.kind) },
    {
      label: "Этапы",
      value: details.stages.map((stage) => titleOf(catalog?.stages, stage)).join("; "),
    },
    { label: "Сроки", value: period },
    { label: "Обсуждение цены", value: titleOf(catalog?.negotiations, details.budget.negotiation) },
  ];

  return (
    <div className={styles.details}>
      <dl className={styles.list}>
        {rows.map((row) => (
          <div
            key={row.label}
            className={styles.row}
          >
            <dt className={styles.label}>{row.label}</dt>
            <dd className={styles.value}>{row.value}</dd>
          </div>
        ))}
        {params.sto_name && (
          <div className={styles.row}>
            <dt className={styles.label}>СТО организации</dt>
            <dd className={styles.value}>{params.sto_name}</dd>
          </div>
        )}
        {params.elements.length > 0 && (
          <div className={styles.row}>
            <dt className={styles.label}>Направления</dt>
            <dd className={styles.value}>
              {params.elements.map((element) => titleOf(catalog?.elements, element)).join("; ")}
            </dd>
          </div>
        )}
      </dl>
      {details.fleet && (
        <p className={styles.fleet}>
          Все ОПО организации: {details.fleet.count}, профиль — {details.fleet.profile}
          {details.fleet.multi_region ? ", есть ОПО в разных субъектах РФ" : ""}
        </p>
      )}
      {details.objects.length > 0 && (
        <ol className={styles.objects}>
          {details.objects.map((item) => (
            <li
              key={item.reg_number}
              className={styles.object}
            >
              <span className={styles.objectName}>{item.name}</span>
              <span className={styles.objectMeta}>
                {item.reg_number} · {item.hazard_class} класс · {item.industry}
              </span>
              <span className={styles.objectMeta}>{item.address}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}